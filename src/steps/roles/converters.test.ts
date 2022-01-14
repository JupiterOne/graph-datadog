import { Role } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/Role';
import { getMockRole } from '../../../test/mocks';
import { createRoleEntity } from './converters';

describe('#createRoleEntity', () => {
  test('should convert to entity', () => {
    expect(createRoleEntity(getMockRole() as Role)).toMatchSnapshot();
  });
});
