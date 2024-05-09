import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export interface navButton {
  readonly icon: string;
  readonly routerLink: string;
  readonly method?: any;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  // COMPONENT STATE
  public navButtons: navButton[] = [
    { icon: 'perm_identity', routerLink: '/' },
    { icon: 'forum', routerLink: '/home/conversations' },
    { icon: 'contacts', routerLink: '/home/contacts' },
    { icon: 'settings', routerLink: '/home/settings' },
    { icon: 'logout', routerLink: '', method: () => this.logout() }
  ]

  // COMPONENT INPUTS
  @Input() user: any;

  // COMPONENT OUTPUTS
  @Output() showConversations: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setLanguage: EventEmitter<object> = new EventEmitter<object>()
  @Output() showChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showSettings: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() profileClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private authService: AuthService) {
  }

  /** PUBLIC METHODS */
  public logout(): void {
    this.authService.logoutUser();
    return;
  }
}
