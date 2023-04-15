import { Injectable } from '@angular/core';
import { AppConfigurationClient } from '@azure/app-configuration';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private appConfigClient: AppConfigurationClient;

  constructor() {
    const tokenCredential: any = {
      getToken: async () => {
        return { token: environment.azureClientID, expiresOnTimestamp: Date.now() + 60 * 60 * 1000 };
      },
    };

    this.appConfigClient = new AppConfigurationClient(environment.appConfigEndpoint, tokenCredential);
  }

  async loadAppConfig(): Promise<void> {
    const settings: any = await this.appConfigClient.listConfigurationSettings();

    for (const setting of settings) {
      environment[setting.key as keyof typeof environment] = setting.value;
    }
  }
}
