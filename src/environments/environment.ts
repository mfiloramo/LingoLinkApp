export const environment: any = {
  production: '#{production}#',
  redirectURI: location.origin,
  apiBaseUrl: '#{apiBaseUrl}#',
  azureTenantID: 'https://login.microsoftonline.com/' + '#{azureTenantID}#',
  azureClientID: '#{azureClientID}#',
  azureAPIClientID: '#{azureAPIClientID}#',
  appConfigEndpoint: '#{appConfigEndpoint}#',
};
