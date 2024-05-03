import { Component, OnInit } from '@angular/core';
import { routerAnimationFade } from "../utils/routerAnimations";
import { DisplayService } from "./services/display/display.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: routerAnimationFade,
})
export class AppComponent implements OnInit {
  public title: string = 'LingoLinkApp';

  constructor(private display: DisplayService) {}

  public ngOnInit(): void {
    this.display.loadSettings();
  }
}
