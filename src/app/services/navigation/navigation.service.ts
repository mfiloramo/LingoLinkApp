import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd): void => {
      // ACCESS EVENT'S PROPERTY DIRECTLY
      this.history.push(event.urlAfterRedirects);
    });
  }

  /** PUBLIC METHODS */
  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/';
  }

  public navigateBack(): void {
    if (this.history.length > 1) {
      this.router.navigateByUrl(this.getPreviousUrl());
    }
  }
}
