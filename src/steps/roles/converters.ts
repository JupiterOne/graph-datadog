import { Role } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/Role';
import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

function getRoleKey(id: string): string {
  return `datadog_role:${id}`;
}

export function createRoleEntity(role: Role): Entity | null {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _type: Entities.ROLE._type,
        _class: Entities.ROLE._class,
        _key: getRoleKey(role.id as string),
        id: role.id,
        name: role.attributes?.name,
        userCount: role.attributes?.userCount,
        createdAt: parseTimePropertyValue(role.attributes?.createdAt),
        modifiedAt: parseTimePropertyValue(role.attributes?.modifiedAt),
      },
    },
  });
}
