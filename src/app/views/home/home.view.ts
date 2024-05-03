import { Component, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { routerAnimationFade } from "../../../utils/routerAnimations";
import { DisplayService } from "../../services/display/display.service";
import { NavigationService } from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  animations: routerAnimationFade

})
export class HomeView implements OnInit, AfterViewInit {

  constructor(
    public display: DisplayService,
    public navigationService: NavigationService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.display.updateBodyClass();
  }

  public ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  /** PUBLIC METHODS */
  public isChatRoute(): boolean {
    return this.router.url === '/home/chat';
  }
}
