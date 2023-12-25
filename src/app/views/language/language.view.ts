import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from "../../components/language-selector/language-selector.component";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [ CommonModule, LanguageSelectorComponent, MatIconModule, RouterLink ],
  templateUrl: './language.view.html',
  styleUrls: ['./language.view.css', '../../components/messages/messages.component.css', '../settings/settings.view.css']
})
export class LanguageView {

}
