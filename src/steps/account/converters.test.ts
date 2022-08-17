import { getMockAccount } from '../../../test/mocks';
import {
  createAccountEntity,
  createOrganizationAccountEntity,
} from './converters';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    expect(createAccountEntity('Local Integration')).toMatchSnapshot();
  });
});

describe('#createOrganizationAccountEntity', () => {
  test('should convert to entity', () => {
    expect(createOrganizationAccountEntity(getMockAccount())).toMatchSnapshot();
  });
});
