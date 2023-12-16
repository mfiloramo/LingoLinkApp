import { Component, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { routerAnimation } from "../../../utils/routerAnimation";

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrls: [ './home.view.css' ],
  animations: routerAnimation,

})
export class HomeView implements AfterViewInit {
  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  /** PUBLIC METHODS */
  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  public isChatRoute(): boolean {
    return this.router.url === '/home/chat';
  }
}
