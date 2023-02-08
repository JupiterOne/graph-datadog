import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/User';
import { Role } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/Role';
import { Host } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/Host';
import { client, v1, v2 } from '@datadog/datadog-api-client';
import { retry } from '@lifeomic/attempt';
import fetch from 'node-fetch';

import { IntegrationConfig } from './config';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  private configuration: client.Configuration;
  private readonly pageSize = 100;

  constructor(readonly config: IntegrationConfig) {
    this.configuration = client.createConfiguration({
      authMethods: {
        apiKeyAuth: config.datadogApiKey,
        appKeyAuth: config.datadogAppKey,
      },
    });

    client.setServerVariables(this.configuration, {
      site: config.datadogHost ? config.datadogHost : 'datadoghq.com',
    });
  }

  private async iterateApi<T, K>(
    client: K,
    fnName: string,
    responseDataProperty: string,
    callback: (result: T[]) => Promise<void>,
    opts?: any,
  ) {
    let pageNumber = 0,
      processed = 0,
      totalCount = 0;

    do {
      try {
        const res = await retry(
          async () => {
            const res = await client[fnName]({
              ...opts,
              pageSize: this.pageSize,
              pageNumber: pageNumber,
            });
            return res;
          },
          {
            delay: 5000,
            factor: 2,
            maxAttempts: 5,
            // only retry on 429
            handleError: (err, context) => {
              if (err.code !== 429) {
                context.abort();
              }
            },
          },
        );

        if (res[responseDataProperty]) {
          await callback(res[responseDataProperty]);
        }

        totalCount = res.meta?.page?.totalCount || 0;
        processed += this.pageSize;
        pageNumber += 1;
      } catch (err) {
        throw new IntegrationProviderAPIError({
          endpoint: fnName,
          status: err.code,
          statusText: err.body,
          cause: err,
        });
      }
    } while (totalCount > processed);
  }

  public async verifyAuthentication(): Promise<void> {
    const apiInstance = new v1.AuthenticationApi(this.configuration);
    try {
      const res = await apiInstance.validate();
      if (!res.valid) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: 'https://api.datadoghq.com/api/v1/validate',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    const apiInstance = new v2.UsersApi(this.configuration);

    await this.iterateApi<User, v2.UsersApi>(
      apiInstance,
      'listUsers',
      'data',
      async (users) => {
        for (const user of users) {
          await iteratee(user);
        }
      },
    );
  }

  /**
   * Fetches the singleton top-level account resource in the provider.
   */
  public async getAccount(): Promise<User | undefined> {
    // v2 doesn't have a way of getting current user via email (only by id)
    // might be hard to ask customers to provide the user id in .env
    // considering they won't know the id unless they run the integration
    // or dig deeper into Datadog. This only "problematic" if we want to
    // have this Entity as a root entity (e.g. usually account entity)

    const apiInstance = new v1.UsersApi(this.configuration);

    const account = await apiInstance.getUser({
      userHandle: this.config.datadogAccountEmail,
    });
    return account.user;
  }

  /**
   * Iterates each role resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateRoles(iteratee: ResourceIteratee<Role>): Promise<void> {
    const apiInstance = new v2.RolesApi(this.configuration);

    await this.iterateApi<Role, v2.RolesApi>(
      apiInstance,
      'listRoles',
      'data',
      async (roles) => {
        for (const role of roles) {
          await iteratee(role);
        }
      },
    );
  }

  /**
   * Iterates each user resource for a given role in the provider.
   *
   * @param iteratee receives each user for a given role to produce entities/relationships
   */
  public async iterateRoleUsers(
    roleId: string,
    iteratee: ResourceIteratee<User>,
  ): Promise<void> {
    const apiInstance = new v2.RolesApi(this.configuration);

    await this.iterateApi<User, v2.RolesApi>(
      apiInstance,
      'listRoleUsers',
      'data',
      async (users) => {
        for (const user of users) {
          await iteratee(user);
        }
      },
      { roleId },
    );
  }

  public async fetchOrganization(
    publicId: string,
  ): Promise<v1.OrganizationResponse> {
    const apiInstance = new v1.OrganizationsApi(this.configuration);

    return apiInstance.getOrg({
      publicId,
    });
  }

  /**
   * An existing bug in the datadog package requires the use of node-fetch
   * for the host endpoint.
   * @param iteratee
   */
  public async iterateHosts(iteratee: ResourceIteratee<Host>): Promise<void> {
    const endpoint = '/v1/hosts';

    const requestSize = 1000;
    let cursor = 0;
    let totalReturned = 0;
    let totalMatching = 0;

    do {
      const url = `https://api.${this.config.datadogHost}/api${endpoint}?count=${requestSize}&start=${cursor}`;

      const response = await retry(
        async () => {
          return await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'DD-API-KEY': this.config.datadogApiKey,
              'DD-APPLICATION-KEY': this.config.datadogAppKey,
            },
          });
        },
        {
          delay: 5000,
          factor: 2,
          maxAttempts: 5,
          // only retry on 429
          handleError: (err, context) => {
            if (err.code !== 429 && err.code < 500) {
              context.abort();
            }
          },
        },
      );

      const data = await response.json();
      for (const host of data.host_list) {
        await iteratee(host);
      }

      cursor = data.totalReturned + 1;
      totalReturned = data.total_returned;
      totalMatching = data.total_matching;
    } while (totalReturned < totalMatching);
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
