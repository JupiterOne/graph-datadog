# Development

This integration focuses on [Datadog](https://www.datadoghq.com/) and is using
the [Datadog API](https://docs.datadoghq.com/api/) for interacting with the
Datadog resources.

## Provider account setup

This integration needs a Datadog account, an API key and an application key.

Follow these steps to obtain these credentials:

1. Register for a Datadog account.
2. Create an API key by going to
   https://app.datadoghq.com/organization-settings/api-keys. (click on 'New Key'
   at the top right corner)
3. Create an application key by going to
   https://app.datadoghq.com/organization-settings/application-keys. (click on
   'New Key' at the top right corner)
4. Take note of these credentials and supply them to the integration's
   [.env file](../env.example).

The integration is now ready.

## Authentication

Once you have supplied the credentials to the `.env` file, the integration will
pull the `EMAIL`, `API_KEY` and `APP_KEY` from there.
