import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/User';
import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getUserKey(email: string, id: string): string {
  return `datadog_user:${email}:${id}`;
}

export function createUserEntity(user: User): Entity | null {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.attributes?.email as string, user.id as string),
        createdOn: parseTimePropertyValue(user.attributes?.createdAt),
        updatedOn: parseTimePropertyValue(user.attributes?.modifiedAt),
        username: user.attributes?.handle,
        email: user.attributes?.email,
        id: user.id,
        name: user.attributes?.name || user.attributes?.email,
        verified: user.attributes?.verified,
        disabled: user.attributes?.disabled,
        active: !user.attributes?.disabled,
        icon: user.attributes?.icon,
        displayName: user.attributes?.name || user.attributes?.email,
      },
    },
  });
}
