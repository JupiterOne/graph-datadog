import { Host } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/Host';
import { getMockHost } from '../../../test/mocks';
import { createHostEntity, determineOsVersion } from './converters';

describe('#createHostEntity', () => {
  test('should convert to entity', () => {
    expect(createHostEntity(getMockHost() as Host)).toMatchSnapshot();
  });

  test('#determineOsVersion', () => {
    expect(
      determineOsVersion({
        macV: ['13.1', ['', '', ''], 'amd64'],
        winV: undefined,
        nixV: null,
      }),
    ).toBe('13.1 amd64');

    expect(
      determineOsVersion({
        macV: undefined,
        winV: ['Windows'],
        nixV: [[], [''], [null, undefined, '']],
      }),
    ).toBe('Windows');

    expect(
      determineOsVersion({
        macV: undefined,
        winV: ['', null, undefined],
        nixV: ['ubuntu', '22.04', ''],
      }),
    ).toBe('ubuntu 22.04');
  });
});
