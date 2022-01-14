import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_DATA_KEY, Entities, Steps } from '../constants';
import { createAccountEntity } from './converters';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const account = await apiClient.getAccount();
  if (account) {
    const accountEntity = await jobState.addEntity(
      createAccountEntity(account),
    );
    await jobState.setData(ACCOUNT_ENTITY_DATA_KEY, accountEntity);
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
