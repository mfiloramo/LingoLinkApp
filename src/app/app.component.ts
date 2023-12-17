import { Component } from '@angular/core';
import { routerAnimationFade } from "../utils/routerAnimations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: routerAnimationFade,
})
export class AppComponent {
  public title: string = 'worldChatApp';

  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
