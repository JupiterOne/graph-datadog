import { Host } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/Host';
import { getMockHost } from '../../../test/mocks';
import { createHostEntity } from './converters';

describe('#createHostEntity', () => {
  test('should convert to entity', () => {
    expect(createHostEntity(getMockHost() as Host)).toMatchSnapshot();
  });
});
