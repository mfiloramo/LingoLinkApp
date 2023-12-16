import { Component } from '@angular/core';
import { routerAnimation } from "../utils/routerAnimation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: routerAnimation,
})
export class AppComponent {
  public title: string = 'worldChatApp';

  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
