export const environment: any = {
  production: /*#{PRODUCTION}*/ '${PRODUCTION}',
  redirectURI: location.origin,
  apiBaseUrl: /*#{API_BASE_URL}*/ '${API_BASE_URL}',
  azureTenantID: /*#{AZURE_TENANT_URL}*/ '${AZURE_TENANT_URL}',
  azureClientID: /*#{AZURE_CLIENT_ID}*/ '${AZURE_CLIENT_ID}',
  azureAPIClientID: /*#{AZURE_API_CLIENT_ID}*/ '${AZURE_API_CLIENT_ID}',
  appConfigEndpoint: /*#{APP_CONFIG_ENDPOINT}*/ '${APP_CONFIG_ENDPOINT}',
};
