export const environment: any = {
  production: false,
  redirectURI: 'http://localhost:4200',
  apiBaseUrl: 'http://localhost:3000/api',
  // DEBUG: PUT THE ACTUAL TENANT ID? WHAT CONSTITUTES A LOCAL ENV? LOCAL ENV NOT FUNCTIONING
  azureTenantID: '${AZURE_TENANT_ID}',
  azureClientID: '${AZURE_CLIENT_ID}',
  azureAPIClientID: '${AZURE_API_CLIENT_ID}',
  appConfigEndpoint: 'https://lingolink-config.azconfig.io',
};
