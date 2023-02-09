import { Organization } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

/*
  Modifies the key to not contain spaces/upper characters

  "_key": "datadog_account:Local Integration"
  -> to
  "_key": "datadog_account:local-integration"
*/
function getAccountKey(id: string): string {
  return `datadog_account:${id.toLowerCase().split(/\s+/).join('-')}`;
}

export function createAccountEntity(instanceName: string) {
  return createIntegrationEntity({
    entityData: {
      source: {
        name: instanceName,
      },
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountKey(instanceName),
        name: instanceName,
        displayName: instanceName,
      },
    },
  });
}

function getOrganizationAccountKey(id: string): string {
  return `datadog_account:${id}`;
}

export function createOrganizationAccountEntity(account: Organization) {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getOrganizationAccountKey(account.publicId!),
        name: account.name,
        displayName: account.name,
        description: account.description ?? '',
        createdOn: parseTimePropertyValue(account.created),
        billingType: account.billing?.type,
        subscriptionType: account.subscription?.type,
        'settings.privateWidgetShare': account.settings?.privateWidgetShare,
        'settings.samlEnabled': account.settings?.saml?.enabled,
        'settings.samlAutocreateAccessRole': account.settings
          ?.samlAutocreateAccessRole as 'st' | 'adm' | 'ro' | 'ERROR',
        'settings.samlAutocreateUsersDomainsEnabled':
          account.settings?.samlAutocreateUsersDomains?.enabled,
        'settings.samlCanBeEnabled': account.settings?.samlCanBeEnabled,
        'settings.samlIdpEndpoint': account.settings?.samlIdpEndpoint,
        'settings.samlIdpInitiatedLoginEnabled':
          account.settings?.samlIdpInitiatedLogin?.enabled,
        'settings.samlIdpMetadataUploaded':
          account.settings?.samlIdpMetadataUploaded,
        'settings.samlLoginUrl': account.settings?.samlLoginUrl,
        'settings.samlStrictModeEnabled':
          account.settings?.samlStrictMode?.enabled,
      },
    },
  });
}
