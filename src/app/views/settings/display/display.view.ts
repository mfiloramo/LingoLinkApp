import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent ],
  templateUrl: './display.view.html'
})
export class DisplayView {
  private readonly darkModeKey: 'lingolink-user-dark-mode' = 'lingolink-user-dark-mode';

  constructor() {
    this.loadDarkMode();
  }

  /** PUBLIC METHODS */
  public toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkModeEnabled());
  }

  public isDarkModeEnabled(): boolean {
    return document.body.classList.contains('dark');
  }

  /** PRIVATE METHODS */
  private setDarkMode(enable: boolean): void {
    if (enable) {
      document.body.classList.add('dark');
      localStorage.setItem(this.darkModeKey, 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.removeItem(this.darkModeKey);
    }
  }

  private loadDarkMode(): void {
    const darkMode: boolean = localStorage.getItem(this.darkModeKey) === 'true';
    this.setDarkMode(darkMode);
  }
}
