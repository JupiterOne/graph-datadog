import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const roleSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://api.datadoghq.com/api/v2/roles
     * PATTERN: Fetch Entities
     */
    id: 'fetch-roles',
    name: 'Fetch Roles',
    entities: [
      {
        resourceName: 'Role',
        _type: 'datadog_role',
        _class: ['AccessRole'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
  {
    id: 'build-account-role-relationships',
    name: 'Build Account Role Relationships',
    entities: [],
    relationships: [
      {
        _type: 'datadog_account_has_role',
        _class: RelationshipClass.HAS,
        sourceType: 'datadog_account',
        targetType: 'datadog_role',
      },
    ],
    dependsOn: ['fetch-account', 'fetch-roles'],
    implemented: true,
  },
];
