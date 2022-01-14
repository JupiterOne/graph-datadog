import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/User';
import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

function getAccountKey(id: string): string {
  return `datadog_account:${id}`;
}

export function createAccountEntity(account: User) {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountKey(account.email?.toString() as string),
        name: account.email,
        username: account.handle,
        email: account.email,
        id: account.email,
        verified: account.verified,
        disabled: account.disabled,
        icon: account.icon,
        displayName: account.name || '',
        accessRole: account.accessRole,
      },
    },
  });
}
