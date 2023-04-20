import { Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';

function isIEOrEdge() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  const trident = ua.indexOf('Trident/');
  const edge = ua.indexOf('Edge/');
  return msie > 0 || trident > 0 || edge > 0;
}

export const msalConfig: any = {
  auth: {
    clientId: environment.azureClientID,
    redirectUri: environment.redirectURI,
    authority: `https://login.microsoft.com/${environment.azureTenantID}`,
    navigateToLoginRequestUrl: false,
    // Add user.read scope
    scopes: ['openid', 'profile', 'email', 'user.read', `api://${environment.azureAPIClientID}/LingoLinkCore`],
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIEOrEdge(),
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
