import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import { v1 } from '@datadog/datadog-api-client';

import { IntegrationConfig } from './config';
import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/User';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private configuration: v1.Configuration;

  constructor(readonly config: IntegrationConfig) {
    this.configuration = v1.createConfiguration({
      authMethods: {
        apiKeyAuth: config.datadogApiKey,
        appKeyAuth: config.datadogAppKey,
      },
    });
  }

  public async verifyAuthentication(): Promise<void> {
    // TODO make the most light-weight request possible to validate
    // authentication works with the provided credentials, throw an err if
    // authentication fails
    const apiInstance = new v1.AuthenticationApi(this.configuration);
    try {
      const res = await apiInstance.validate();
      console.log(res);
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
    const apiInstance = new v1.UsersApi(this.configuration);
    const res = await apiInstance.listUsers();
    if (res.users) {
      for (const user of res.users) {
        await iteratee(user);
      }
    } else {
      return;
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
