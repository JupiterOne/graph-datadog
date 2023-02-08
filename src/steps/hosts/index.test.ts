import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildAccountHostRelationships, fetchHosts } from '.';
import { integrationConfig } from '../../../test/config';
import { setupDatadogRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchAccount } from '../account';
import { Entities, Relationships } from '../constants';

describe('#fetchHosts', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatadogRecording({
      directory: __dirname,
      name: 'fetchHosts',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchHosts(context);

    const hosts = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.HOST._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(hosts.length).toBeGreaterThan(0);
    expect(hosts).toMatchGraphObjectSchema({
      _class: Entities.HOST._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.HOST._type },
          _class: { const: Entities.HOST._class },
          _key: { type: 'string' },
          id: { type: 'string' },
          aliases: {
            type: 'array',
            items: { type: 'string' },
          },
          apps: {
            type: 'array',
            items: { type: 'string' },
          },
          awsName: { type: 'string' },
          hostname: { type: 'string' },
          isMuted: { type: 'boolean' },
          reportedOn: { type: 'number' },
          name: { type: 'string' },
          sources: {
            type: 'array',
            items: { type: 'string' },
          },
          state: { type: 'string' },
          agentVersion: { type: 'string' },
          hostCpuCores: { type: 'number' },
          machine: { type: 'string' },
          platform: { type: 'string' },
          processor: { type: 'string' },
          pythonVersion: { type: 'string' },
          socketFqdn: { type: 'string' },
          socketHostname: { type: 'string' },
          osName: { type: 'string' },
          osVersion: { type: 'string' },
        },
      },
    });
  });
});

describe('#buildAccountHostRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatadogRecording({
      directory: __dirname,
      name: 'buildAccountHostRelationships',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchAccount(context);
    await fetchHosts(context);
    await buildAccountHostRelationships(context);

    const accounts = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.ACCOUNT._type),
    );

    const hosts = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.HOST._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(hosts.length).toBeGreaterThan(0);
    expect(hosts).toMatchGraphObjectSchema({
      _class: Entities.HOST._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.HOST._type },
          _class: { const: Entities.HOST._class },
          _key: { type: 'string' },
          id: { type: 'string' },
          aliases: {
            type: 'array',
            items: { type: 'string' },
          },
          apps: {
            type: 'array',
            items: { type: 'string' },
          },
          awsName: { type: 'string' },
          hostname: { type: 'string' },
          isMuted: { type: 'boolean' },
          reportedOn: { type: 'number' },
          name: { type: 'string' },
          sources: {
            type: 'array',
            items: { type: 'string' },
          },
          state: { type: 'string' },
          agentVersion: { type: 'string' },
          hostCpuCores: { type: 'number' },
          machine: { type: 'string' },
          platform: { type: 'string' },
          processor: { type: 'string' },
          pythonVersion: { type: 'string' },
          socketFqdn: { type: 'string' },
          socketHostname: { type: 'string' },
          osName: { type: 'string' },
          osVersion: { type: 'string' },
        },
      },
    });

    expect(accounts.length).toEqual(1);
    expect(accounts).toMatchGraphObjectSchema({
      _class: Entities.ACCOUNT._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ACCOUNT._type },
          _class: { const: Entities.ACCOUNT._class },
          _key: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          verified: { type: 'boolean' },
          disabled: { type: 'boolean' },
          icon: { type: 'string' },
          displayName: { type: 'string' },
          accessRole: { type: 'string' },
        },
      },
    });

    expect(
      context.jobState.collectedRelationships.filter(
        (e) => e._type === Relationships.ACCOUNT_HAS_HOST._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: { const: 'datadog_account_has_host' },
        },
      },
    });
  });
});
