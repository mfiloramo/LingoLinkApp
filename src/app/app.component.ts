import { Component, OnInit } from '@angular/core';
import { routerAnimationFade } from "../utils/routerAnimations";
import { DarkModeService } from "./services/darkMode/dark-mode.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: routerAnimationFade,
})
export class AppComponent implements OnInit {
  public title: string = 'LingoLinkApp';

  constructor(private darkMode: DarkModeService) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.darkMode.loadDarkMode();
  }

  /** PUBLIC METHODS */
  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
