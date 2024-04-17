import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from "@angular/router";
import { UserService } from "../../../../services/user/user.service";
import { TranslationService } from "../../../../services/translation/translation.service";

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterOutlet ],
  templateUrl: './account-info.view.html',
})
export class AccountInfoView {
  public defaultLanguage: any = null;
  public accountInfoSlices: any[] = [
    {
      name: this.userService.userState().username,
      properName: 'Username'
    },
    {
      name: this.userService.userState().firstName,
      properName: 'First Name'
    },
    {
      name: this.userService.userState().lastName,
      properName: 'Last Name'
    },
    {
      name: this.userService.userState().email,
      properName: 'Email'
    },
    {
      name: this.translationService.getLanguageDetails(this.userService.userState().defaultLanguage),
      properName: 'Default Language'
    }
  ]

  constructor(
    public userService: UserService,
    private translationService: TranslationService,
  ) {}
}
