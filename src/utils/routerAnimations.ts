import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger as animationTrigger
} from "@angular/animations";

export const routerAnimationFade: Array<AnimationTriggerMetadata> = [
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
  ])
]

export const routerAnimationSlide: Array<AnimationTriggerMetadata> = [
  animationTrigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
      group([
        query(':enter', [style({ transform: 'translateX(100%)' }), animate('0.1s ease-in', style({ transform: 'translateX(0%)' }))], { optional: true }),
        query(':leave', [style({ transform: 'translateX(0%)' }), animate('0.1s ease-in', style({ transform: 'translateX(-100%)' }))], { optional: true })
      ])
    ])
  ])
]
