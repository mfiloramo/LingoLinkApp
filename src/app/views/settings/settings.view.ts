import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { LanguageSelectorComponent } from "../../components/language-selector/language-selector.component";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule, LanguageSelectorComponent, RouterLink, RouterOutlet ],
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.css']
})
export class SettingsView {

}
