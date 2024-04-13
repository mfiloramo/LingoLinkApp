import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, RouterOutlet ],
  templateUrl: './main-settings.view.html',
  styleUrl: './main-settings.view.css'
})
export class MainSettingsView {

}
