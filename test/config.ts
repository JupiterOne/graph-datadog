import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_KEY = 'dummy-api-key';
const DEFAULT_APP_KEY = 'dummy-app-key';
const DEFAULT_EMAIL = 'stefan@creativice.com';

export const integrationConfig: IntegrationConfig = {
  datadogApiKey: process.env.DATADOG_API_KEY || DEFAULT_API_KEY,
  datadogAppKey: process.env.DATADOG_APP_KEY || DEFAULT_APP_KEY,
  datadogAccountEmail: process.env.DATADOG_ACCOUNT_EMAIL || DEFAULT_EMAIL,
};
