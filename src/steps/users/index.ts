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
import { createUserEntity, getUserKey } from './converters';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    if (userEntity) {
      await jobState.addEntity(userEntity);
    }
  });
}

export async function buildAccountUserRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(
    ACCOUNT_ENTITY_DATA_KEY,
  )) as Entity;

  if (!accountEntity) {
    return;
  }

  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: userEntity,
        }),
      );
    },
  );
}

export async function buildUserRoleRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.ROLE._type },
    async (roleEntity) => {
      await apiClient.iterateRoleUsers(
        roleEntity.id as string,
        async (user) => {
          const userEntity = await jobState.findEntity(
            getUserKey(user.attributes?.email as string),
          );
          if (userEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.ASSIGNED,
                from: userEntity,
                to: roleEntity,
              }),
            );
          }
        },
      );
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.BUILD_ACCOUNT_USER_RELATIONSHIPS,
    name: 'Build Account User Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT, Steps.USERS],
    executionHandler: buildAccountUserRelationships,
  },
  {
    id: Steps.BUILD_USER_ROLE_RELATIONSHIPS,
    name: 'Build User Role Relationships',
    entities: [],
    relationships: [Relationships.USER_ASSIGNED_ROLE],
    dependsOn: [Steps.USERS, Steps.ROLES],
    executionHandler: buildUserRoleRelationships,
  },
];
