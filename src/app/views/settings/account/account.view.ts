import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent, RouterOutlet ],
  templateUrl: './account.view.html',
  styleUrls: ['./account.view.css' ]
})
export class AccountView {

}
