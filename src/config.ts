import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  datadogApiKey: {
    type: 'string',
    mask: true,
  },
  datadogAppKey: {
    type: 'string',
    mask: true,
  },
  datadogAccountEmail: {
    type: 'string',
  },
  datadogHost: {
    type: 'string',
  },
  datadogOrgPublicId: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  datadogApiKey: string;
  datadogAppKey: string;
  datadogAccountEmail: string;
  datadogHost?: string;
  datadogOrgPublicId?: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (
    !config.datadogApiKey ||
    !config.datadogAppKey ||
    !config.datadogAccountEmail
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {apiKey,appKey,email}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
