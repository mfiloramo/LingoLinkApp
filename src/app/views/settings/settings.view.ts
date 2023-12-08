import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './settings.view.html',
  styleUrl: './settings.view.css'
})
export class SettingsView {

}
