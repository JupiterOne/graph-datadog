import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.datadoghq.com/api/v2/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'datadog_user',
        _class: ['User'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    id: 'build-account-user-relationships',
    name: 'Build Account User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'datadog_account_has_user',
        _class: RelationshipClass.HAS,
        sourceType: 'datadog_account',
        targetType: 'datadog_user',
      },
    ],
    dependsOn: ['fetch-account', 'fetch-users'],
    implemented: true,
  },
  {
    id: 'build-user-role-relationships',
    name: 'Build User Role Relationships',
    entities: [],
    relationships: [
      {
        _type: 'datadog_user_assigned_role',
        _class: RelationshipClass.ASSIGNED,
        sourceType: 'datadog_user',
        targetType: 'datadog_role',
      },
    ],
    dependsOn: ['fetch-users', 'fetch-roles'],
    implemented: true,
  },
];
