import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";
import { routerAnimationFade } from "../../../../utils/routerAnimations";

export interface ChangeDataButton {
  readonly name: string;
  readonly route: string;
}
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent, RouterOutlet ],
  templateUrl: './account.view.html',
  animations: routerAnimationFade
})
export class AccountView {
  public changeDataButtons: ChangeDataButton[] = [
    {
      name: 'Change Username',
      route: 'change-username'
    },
    {
      name: 'Change Name',
      route: 'change-name'
    },
    {
      name: 'Change Email',
      route: 'change-email'
    },
    {
      name: 'Change Password',
      route: 'change-password'
    }
  ];
  constructor(public router: Router) {}
}
