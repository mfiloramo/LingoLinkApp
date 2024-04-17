import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  public selectedOption: 'light-mode' | 'dark-mode' = 'light-mode';
  private readonly darkModeKey: string = 'lingolink-dark-mode';

  constructor() {}

  /** PUBLIC METHODS */
  public loadDarkMode(): void {
    const darkMode: boolean = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(darkMode);
  }

  public toggleDarkMode(): void {
    this.setDarkMode(this.selectedOption !== 'dark-mode');
  }

  public isDarkModeEnabled(): boolean {
    return this.selectedOption === 'dark-mode';
  }

  /** PRIVATE METHOD */
  private setDarkMode(enable: boolean): void {
    if (enable) {
      localStorage.setItem(this.darkModeKey, 'true');
      this.selectedOption = 'dark-mode';
    } else {
      localStorage.removeItem(this.darkModeKey);
      this.selectedOption = 'light-mode';
    }
  }
}
