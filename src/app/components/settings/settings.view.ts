import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule, LanguageSelectorComponent ],
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.css']
})
export class SettingsView {

}
