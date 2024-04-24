import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { NavigationService } from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './title.component.html',
  styleUrls: [ './title.component.css' ]
})
export class TitleComponent {
  public title: WritableSignal<any> = this.navigationService.pageTitle;

  constructor(public navigationService: NavigationService) { }
}
