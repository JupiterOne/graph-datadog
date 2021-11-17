import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_DATA_KEY = 'entity:account';

export const Steps = {
  USERS: 'fetch-users',
  ACCOUNT: 'fetch-account',
  ROLES: 'fetch-roles',
  BUILD_ACCOUNT_USER_RELATIONSHIPS: 'build-account-user-relationships',
  BUILD_ACCOUNT_ROLE_RELATIONSHIPS: 'build-account-role-relationships',
  BUILD_USER_ROLE_RELATIONSHIPS: 'build-user-role-relationships',
};

export const Entities: Record<'USER' | 'ACCOUNT' | 'ROLE', StepEntityMetadata> =
  {
    USER: {
      resourceName: 'User',
      _type: 'datadog_user',
      _class: ['User'],
    },
    ACCOUNT: {
      resourceName: 'Account',
      _type: 'datadog_account',
      _class: ['User'],
    },
    ROLE: {
      resourceName: 'Role',
      _type: 'datadog_role',
      _class: ['AccessRole'],
    },
  };

export const Relationships: Record<
  'ACCOUNT_HAS_USER' | 'ACCOUNT_HAS_ROLE' | 'USER_ASSIGNED_ROLE',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'datadog_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'datadog_account_has_role',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.ROLE._type,
  },
  USER_ASSIGNED_ROLE: {
    _type: 'datadog_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
  },
};
