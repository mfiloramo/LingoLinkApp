import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  public displayMode: 'light-mode' | 'dark-mode' = 'light-mode';
  public fontSize: string | null = null;
  public boldText: boolean = false;
  private readonly darkModeKey: string = 'lingolink-dark-mode';
  private readonly fontSizeKey: string = 'lingolink-font-size';
  private readonly boldTextKey: string = 'lingolink-bold-text';

  constructor() {
    this.loadSettings();
  }

  /** PUBLIC METHODS */
  public loadSettings(): void {
    this.loadDarkMode();
    this.loadFontSize();
    this.loadBoldText();
  }

  public loadDarkMode(): void {
    const darkMode: boolean = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(darkMode);
  }

  public loadFontSize(): void {
    const fontSize: string | null = localStorage.getItem(this.fontSizeKey);
    this.setFontSize(fontSize);
  }

  public loadBoldText(): void {
    const boldText: boolean = localStorage.getItem(this.boldTextKey) === 'true';
    this.setBoldText(boldText);
  }

  public toggleDarkMode(): void {
    this.setDarkMode(this.displayMode !== 'dark-mode');
  }

  public isDarkModeEnabled(): boolean {
    return this.displayMode === 'dark-mode';
  }

  public setBoldText(isBold: boolean): void {
    this.boldText = isBold;
    localStorage.setItem(this.boldTextKey, isBold.toString());
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

  private setFontSize(fontSize: string | null): void {
    this.fontSize = fontSize;
    localStorage.setItem(this.fontSizeKey, fontSize || '');
  }

}
