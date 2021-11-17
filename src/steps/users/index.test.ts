import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchUsers } from '.';
import { integrationConfig } from '../../../test/config';
import { setupZendeskRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';

describe('#fetchUsers', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupZendeskRecording({
      directory: __dirname,
      name: 'fetchUsers',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchUsers(context);

    const users = context.jobState.collectedEntities.filter((e) =>
      e._type.includes(Entities.USER._type),
    );

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(users.length).toBeGreaterThan(0);
    expect(users).toMatchGraphObjectSchema({
      _class: Entities.USER._class,
      schema: {
        additionalProperties: false,
        required: [],
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.USER._type },
          _class: { const: Entities.USER._class },
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
  });
});
