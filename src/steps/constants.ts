import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  USERS: 'fetch-users',
};

export const Entities: Record<'USER', StepEntityMetadata> = {
  USER: {
    resourceName: 'User',
    _type: 'datadog_user',
    _class: ['User'],
  },
};
