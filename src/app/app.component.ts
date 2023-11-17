import { Component } from '@angular/core';
import { UserService } from "./services/user/user.service";
import { trigger, transition, style, animate, query, animateChild, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ], { optional: true }),
        query(':enter', [style({ opacity: 0 }), animateChild()], { optional: true }),
        group([
          query(':leave', [animate('0.3s ease-in-out', style({ opacity: 0 }))], { optional: true }),
          query(':enter', [animate('0.3s ease-in-out', style({ opacity: 1 }))], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  public title: string = 'worldChatApp';

  prepareRoute(outlet: any): void {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
