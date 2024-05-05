import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent ],
  templateUrl: './avatar.view.html',
})
export class AvatarView {
}
