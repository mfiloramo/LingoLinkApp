import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink ],
  templateUrl: './info.view.html',
  styleUrls: ['./info.view.css', '../../components/messages/messages.component.css', '../settings/settings.view.css']
})
export class InfoView {

}
