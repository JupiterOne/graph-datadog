import { accountSteps } from './account';
import { roleSteps } from './roles';
import { userSteps } from './users';

const integrationSteps = [...userSteps, ...accountSteps, ...roleSteps];

export { integrationSteps };
