import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  public displayMode: 'light-mode' | 'dark-mode' = 'light-mode';
  public fontSize: string | null = null;
  public boldText: boolean = false;
  private readonly darkModeKey = 'lingolink-dark-mode';
  private readonly fontSizeKey = 'lingolink-font-size';
  private readonly boldTextKey = 'lingolink-bold-text';

  constructor() {
    this.loadSettings();
  }

  /** PUBLIC METHODS */
  public loadSettings(): void {
    this.loadDarkMode();
    this.loadFontSize();
    this.loadBoldText();
  }

  public updateBodyClass(): void {
    document.body.classList.toggle('dark', this.isDarkModeEnabled());
  }

  public loadDarkMode(): void {
    this.setDarkMode(localStorage.getItem(this.darkModeKey) === 'true');
  }

  public loadFontSize(): void {
    this.setFontSize(localStorage.getItem(this.fontSizeKey));
  }

  public loadBoldText(): void {
    this.setBoldText(localStorage.getItem(this.boldTextKey) === 'true');
  }

  public toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkModeEnabled());
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
    this.displayMode = enable ? 'dark-mode' : 'light-mode';
    localStorage.setItem(this.darkModeKey, enable.toString());
  }

  private setFontSize(fontSize: string | null): void {
    this.fontSize = fontSize;
    localStorage.setItem(this.fontSizeKey, fontSize || '');
  }
}
