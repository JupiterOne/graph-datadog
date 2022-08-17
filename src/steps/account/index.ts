import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_DATA_KEY, Entities, Steps } from '../constants';
import {
  createAccountEntity,
  createOrganizationAccountEntity,
} from './converters';

export async function fetchAccount({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  if (instance.config.datadogOrgPublicId) {
    let accountEntity;

    try {
      const organization = await apiClient.fetchOrganization(
        instance.config.datadogOrgPublicId,
      );

      accountEntity = organization.org
        ? createOrganizationAccountEntity(organization.org)
        : createAccountEntity(instance.name);
    } catch (err) {
      logger.warn({ err }, 'Unable to fetch Datadog organization information');
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description:
          'Unable to fetch Datadog organization information. Please validate your Datadog organization public ID integration configuration value.',
      });

      accountEntity = createAccountEntity(instance.name);
    }

    await jobState.addEntity(accountEntity);
    await jobState.setData(ACCOUNT_ENTITY_DATA_KEY, accountEntity);
  } else {
    const accountEntity = await jobState.addEntity(
      createAccountEntity(instance.name),
    );

    await jobState.setData(ACCOUNT_ENTITY_DATA_KEY, accountEntity);

    logger.info('Customer did not supply organizationPublicId in config');
    logger.publishWarnEvent({
      name: IntegrationWarnEventName.MissingPermission,
      description:
        'Configure the organization public ID integration field to obtain additional information on datadog_account',
    });
  }
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
