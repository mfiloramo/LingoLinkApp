import { Component, Output } from '@angular/core';
import { UserService } from "./login/user.service";
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
        ]),
        query(':enter', [style({ opacity: 0 }), animateChild()]),
        group([
          query(':leave', [animate('0.3s ease-in-out', style({ opacity: 0 }))]),
          query(':enter', [animate('0.3s ease-in-out', style({ opacity: 1 }))]),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  public title: string = 'worldChatApp';

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
  }

  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
