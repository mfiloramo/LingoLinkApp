import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Language } from "../../../interfaces/Language.interfaces";
import languageArray from '../../../utils/languageMapper';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule ],
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.css', '../../components/messages/messages.component.css']
})
export class SettingsView {
  @Output() selectedLanguage: EventEmitter<any> = new EventEmitter<any>();
  public languageArray: Language[] = languageArray;

  /** PUBLIC METHODS */
  public selectLanguage(lang: any): void {
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === lang.target.value);
    if (selectedLanguage) {
      this.selectedLanguage.emit(selectedLanguage);
      console.log('settings.view.selectedLanguage:', selectedLanguage);

    }
  }
}
