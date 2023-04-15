import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { environment } from '../environments/environment';

export const msalBrowserConfig: Configuration = {
  auth: {
    clientId: environment.azureClientID,
    authority: environment.azureTenantID,
    redirectUri: environment.redirectURI,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalBrowserConfig);
