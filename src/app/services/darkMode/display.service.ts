import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  public displayMode: 'light-mode' | 'dark-mode' = 'light-mode';
  public fontSize!: string;
  public boldText!: string;
  private readonly darkModeKey: 'lingolink-dark-mode' = 'lingolink-dark-mode';
  private readonly fontSizeKey: 'lingolink-font-size' = 'lingolink-font-size';
  private readonly boldTextKey: 'lingolink-bold-text' = 'lingolink-bold-text';

  constructor() {}

  /** PUBLIC METHODS */
  public loadDarkMode(): void {
    const darkMode: boolean = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(darkMode);
  }

  public loadFontSize(): void {
    const fontSize: boolean = localStorage.getItem(this.fontSizeKey) === 'true';
    this.setFontSize(this.fontSize);
  }

  public loadBoldText(): void {
    const boldText: boolean = localStorage.getItem(this.boldTextKey) === 'true';
    this.setBoldText(this.boldText);
  }

  public toggleDarkMode(): void {
    this.setDarkMode(this.displayMode !== 'dark-mode');
  }

  public isDarkModeEnabled(): boolean {
    return this.displayMode === 'dark-mode';
  }

  /** PRIVATE METHODS */
  private setDarkMode(enable: boolean): void {
    if (enable) {
      localStorage.setItem(this.darkModeKey, 'true');
      this.displayMode = 'dark-mode';
    } else {
      localStorage.removeItem(this.darkModeKey);
      this.displayMode = 'light-mode';
    }
  }

  private setFontSize(fontSize: string): void {
    this.fontSize = fontSize;
    localStorage.setItem(this.fontSizeKey, this.fontSize)
  }

  private setBoldText(isBold: string): void {
    this.boldText = isBold;
    localStorage.setItem(this.boldTextKey, this.boldText)
  }
}
