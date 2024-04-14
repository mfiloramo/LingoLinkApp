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
export class AccountInfoView implements OnInit {
  public defaultLanguage: any = null;
  constructor(
    public userService: UserService,
    private translationService: TranslationService,
  ) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.defaultLanguage = this.translationService.getLanguageDetails(this.userService.userState().defaultLanguage);
  }
}
