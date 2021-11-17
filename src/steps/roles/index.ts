import {
  RelationshipClass,
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  ACCOUNT_ENTITY_DATA_KEY,
  Entities,
  Relationships,
  Steps,
} from '../constants';
import { createRoleEntity } from './converters';

export async function fetchRoles({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateRoles(async (role) => {
    const roleEntity = createRoleEntity(role);
    if (roleEntity) {
      await jobState.addEntity(roleEntity);
    }
  });
}

export async function buildAccountRoleRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(
    ACCOUNT_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.ROLE._type },
    async (roleEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: roleEntity,
        }),
      );
    },
  );
}

export const roleSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ROLES,
    name: 'Fetch Roles',
    entities: [Entities.ROLE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchRoles,
  },
  {
    id: Steps.BUILD_ACCOUNT_ROLE_RELATIONSHIPS,
    name: 'Build Account Role Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_ROLE],
    dependsOn: [Steps.ACCOUNT, Steps.ROLES],
    executionHandler: buildAccountRoleRelationships,
  },
];
