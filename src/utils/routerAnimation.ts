import { animate, animateChild, group, query, style, transition, trigger as animationTrigger } from "@angular/animations";

export const routerAnimation: Array<any> = [
    animationTrigger('routeAnimations', [
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
          query(':leave', [animate('0.1s ease-in-out', style({ opacity: 0 }))], { optional: true }),
          query(':enter', [animate('0.1s ease-in-out', style({ opacity: 1 }))], { optional: true }),
        ]),
      ]),
    ]),
  ]
