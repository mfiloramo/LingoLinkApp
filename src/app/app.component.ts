import { Component, OnInit } from '@angular/core';
import { routerAnimationFade } from "../utils/routerAnimations";
import { DisplayService } from "./services/darkMode/./display.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: routerAnimationFade,
})
export class AppComponent implements OnInit {
  public title: string = 'LingoLinkApp';

  constructor(private display: DisplayService) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.display.loadDarkMode();
    this.display.loadFontSize();
    this.display.loadBoldText();
  }

  /** PUBLIC METHODS */
  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
