import { Injectable } from '@angular/core';
import { Router, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'})
export class NavigationService {
  public pageTitle: WritableSignal<string> = signal('');
  private history: string[] = [];

  constructor(private router: Router) {
    // INITIALIZE pageTitle BASED ON INITIAL URL
    this.pageTitle.set(this.formatTitleFromUrl(this.router.url));
    this.history.push(this.router.url);

    // LISTEN TO NAVIGATION EVENTS AND UPDATE ACCORDINGLY
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd): void => {
      if (!this.isBackNavigation(event.urlAfterRedirects)) {
        this.history.push(event.urlAfterRedirects);
      }
      this.pageTitle.set(this.formatTitleFromUrl(event.urlAfterRedirects));
    });
  }

  public navigateBack(): void {
    if (this.history.length > 1) {
      this.history.pop();
      const previousUrl: string | undefined = this.history.pop();
      this.router.navigateByUrl(previousUrl!).then((): void => {
        return;
      });
    }
  }

  private isBackNavigation(url: string): boolean {
    if (this.history.length > 1) {
      return url === this.history[this.history.length - 2];
    }
    return false;
  }

  private formatTitleFromUrl(url: string): string {
    const segments: string[] = url.split('/');
    const endpoint: string = segments[segments.length - 1] || '';
    return endpoint.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
