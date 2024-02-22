import {
  RelationshipClass,
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  ACCOUNT_ENTITY_DATA_KEY,
  Entities,
  Relationships,
  Steps,
} from '../constants';
import { createHostEntity } from './converters';

export async function fetchHosts({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  try {
    await apiClient.iterateHosts(async (host) => {
      const hostEntity = createHostEntity(host);

      if (hostEntity) {
        await jobState.addEntity(hostEntity);
      }
    });
  } catch (error) {
    if (error.status == 403) {
      logger.publishWarnEvent({
        name: IntegrationWarnEventName.MissingPermission,
        description: `Received authorization error when attempting to call list.hosts. Please use an unscoped application Key to gather this information.`,
      });
    } else {
      throw error;
    }
  }
}

export async function buildAccountHostRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(
    ACCOUNT_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.HOST._type },
    async (hostEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: hostEntity,
        }),
      );
    },
  );
}

export const hostSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.HOSTS,
    name: 'Fetch Hosts',
    entities: [Entities.HOST],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchHosts,
  },
  {
    id: Steps.BUILD_ACCOUNT_HOST_RELATIONSHIPS,
    name: 'Build Account Host Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_HOST],
    dependsOn: [Steps.ACCOUNT, Steps.HOSTS],
    executionHandler: buildAccountHostRelationships,
  },
];
