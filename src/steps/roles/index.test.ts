import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildAccountRoleRelationships, fetchRoles } from '.';
import { integrationConfig } from '../../../test/config';
import { setupDatadogRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { fetchAccount } from '../account';
import { Entities, Relationships } from '../constants';

describe('#fetchRoles', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatadogRecording({
      directory: __dirname,
      name: 'fetchRoles',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchRoles(context);

    const roles = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.ROLE._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(roles.length).toBeGreaterThan(0);
    expect(roles).toMatchGraphObjectSchema({
      _class: Entities.ROLE._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ROLE._type },
          _class: { const: Entities.ROLE._class },
          _key: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          userCount: { type: 'number' },
          createdAt: { type: 'number' },
          modifiedAt: { type: 'number' },
        },
      },
    });
  });
});

describe('#buildAccountRoleRelationships', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupDatadogRecording({
      directory: __dirname,
      name: 'buildAccountRoleRelationships',
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
    await fetchRoles(context);
    await buildAccountRoleRelationships(context);

    const accounts = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.ACCOUNT._type),
    );

    const roles = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.ROLE._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(roles.length).toBeGreaterThan(0);
    expect(roles).toMatchGraphObjectSchema({
      _class: Entities.ROLE._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.ROLE._type },
          _class: { const: Entities.ROLE._class },
          _key: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          userCount: { type: 'number' },
          createdAt: { type: 'number' },
          modifiedAt: { type: 'number' },
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
        (e) => e._type === Relationships.ACCOUNT_HAS_ROLE._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: 'HAS' },
          _type: { const: 'datadog_account_has_role' },
        },
      },
    });
  });
});
