import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink ],
  templateUrl: './display.view.html',
  styleUrls: ['./display.view.css', '../../components/messages/messages.component.css', '../settings/settings.view.css']
})
export class DisplayView {

}
