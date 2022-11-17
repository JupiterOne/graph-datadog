import { accountSteps } from './account';
import { hostSteps } from './hosts';
import { roleSteps } from './roles';
import { userSteps } from './users';

const integrationSteps = [
  ...userSteps,
  ...accountSteps,
  ...roleSteps,
  ...hostSteps,
];

export { integrationSteps };
