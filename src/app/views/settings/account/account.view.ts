import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";
import { routerAnimationFade } from "../../../../utils/routerAnimations";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent, RouterOutlet ],
  templateUrl: './account.view.html',
  animations: routerAnimationFade,
})
export class AccountView {
  public changeDataButtons: any[] = [
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
  ];
  constructor(public router: Router) {}
}
