import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../services/user/user.service";
import { Language } from "../../../interfaces/Language.interfaces";
import languageArray from "../../../utils/languageMapper";

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {
  protected readonly languageArray: Language[] = languageArray;

  constructor(public userService: UserService) {
    this.languageArray.sort((a: Language, b: Language) => a.name!.localeCompare(b.name!));
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
