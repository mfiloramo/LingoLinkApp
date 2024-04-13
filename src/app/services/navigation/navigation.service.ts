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
    ).subscribe((event: NavigationEnd) => {
      this.history.push(event.urlAfterRedirects); // Now accessing event's property directly
    });
  }

  // Get the previous url
  getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/';
  }

  // Method to navigate back
  navigateBack(): void {
    if (this.history.length > 1) {
      this.router.navigateByUrl(this.getPreviousUrl());
    }
  }
}
