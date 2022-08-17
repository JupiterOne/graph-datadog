import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/User';
import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getUserKey(id: string): string {
  return `datadog_user:${id}`;
}

export function createUserEntity(user: User): Entity | null {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.attributes?.email as string),
        username: user.attributes?.handle,
        email: user.attributes?.email,
        id: user.attributes?.email,
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
