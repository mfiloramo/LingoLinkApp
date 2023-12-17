import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Language } from "../../../interfaces/Language.interfaces";
import languageArray from '../../../utils/languageMapper';
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user/user.service";
import { User } from "../../../interfaces/User.interfaces";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule ],
  templateUrl: './settings.view.html',
  styleUrls: ['./settings.view.css', '../../components/messages/messages.component.css']
})
export class SettingsView implements OnInit {
  public userState!: User;
  public languageArray: Language[] = languageArray;

  constructor(public userService: UserService) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.userState = this.userService.userState();
  }

  /** PUBLIC METHODS */
  public selectLanguage(selectedLanguageEvent: any): void {
    const selectedLanguageName = selectedLanguageEvent.target.value;
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === selectedLanguageName);

    if (selectedLanguage) {
      this.userService.updateUserState({ sourceLanguage: selectedLanguage.code });
    }
  }
}
