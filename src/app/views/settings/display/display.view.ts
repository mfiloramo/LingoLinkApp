import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DarkModeService } from "../../../services/darkMode/dark-mode.service";

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, FormsModule],
  templateUrl: './display.view.html'
})
export class DisplayView {
  constructor(public darkMode: DarkModeService) {}

  ngOnInit(): void {
    this.updateBodyClass();
  }

  updateBodyClass(): void {
    if (this.darkMode.isDarkModeEnabled()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
