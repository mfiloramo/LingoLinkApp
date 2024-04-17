import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DarkModeService } from "../../../services/darkMode/dark-mode.service";

interface DarkModeButton {
  readonly modeLabel: string;
  readonly modeValue: string;
  readonly imgSource: string;
}

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, FormsModule ],
  templateUrl: './display.view.html'
})
export class DisplayView {
  public darkModeButtons: DarkModeButton[] = [
    {
      modeLabel: 'Light',
      modeValue: 'light-mode',
      imgSource: '/assets/images/light-mode-stub.png'
    },
    {
      modeLabel: 'Dark',
      modeValue: 'dark-mode',
      imgSource: '/assets/images/dark-mode-stub.png'
    }
  ]
  constructor(public darkMode: DarkModeService) {
  }

  /** PUBLIC METHODS */
  public updateBodyClass(): void {
    if (this.darkMode.isDarkModeEnabled()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
