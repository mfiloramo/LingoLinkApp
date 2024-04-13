import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { TitleComponent } from "../../../components/title/title.component";

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent ],
  templateUrl: './display.view.html',
  styleUrls: ['./display.view.css' ]
})
export class DisplayView {
  // TODO: ADD DARK MODE OPTIONS
}
