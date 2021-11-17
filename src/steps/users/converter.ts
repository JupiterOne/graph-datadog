import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/User';
import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

function getUserKey(id: string): string {
  return `datadog_user:${id}`;
}

export function createUserEntity(user: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.email?.toString() as string),
        username: user.handle,
        email: user.email,
        id: user.email,
        name: user.name || '',
        verified: user.verified,
        disabled: user.disabled,
        icon: user.icon,
        displayName: user.name || '',
        accessRole: user.accessRole,
      },
    },
  });
}
