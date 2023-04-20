export const environment: any = {
  production: '${PRODUCTION}',
  redirectURI: location.origin,
  apiBaseUrl: '${API_BASE_URL}',
  azureTenantID: '${AZURE_TENANT_ID}', // THESE VALUES SHOULD NOW GET SET
  azureClientID: '${AZURE_CLIENT_ID}',
  azureAPIClientID: '${AZURE_API_CLIENT_ID}',
  appConfigEndpoint: '${APP_CONFIG_ENDPOINT}',
};
