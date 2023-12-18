import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { UserService } from "../../services/user/user.service";
import { Language } from "../../../interfaces/Language.interfaces";
import { User } from "../../../interfaces/User.interfaces";
import languageArray from '../../../utils/languageMapper';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule ],
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.css', '../../components/messages/messages.component.css']
})
export class SettingsView {
  public languageArray: Language[] = languageArray;

  constructor(public userService: UserService) {
    // @ts-ignore
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** PUBLIC METHODS */
  public selectLanguage(selectedLanguageEvent: any): void {
    const selectedLanguageCode = selectedLanguageEvent.target.value;
    const selectedLanguageObj: Language | undefined = this.languageArray.find((language: Language): boolean => language.code === selectedLanguageCode);

    if (selectedLanguageObj) {
      this.userService.updateUserState({ defaultLanguage: selectedLanguageObj.code });
    }
  }
}
