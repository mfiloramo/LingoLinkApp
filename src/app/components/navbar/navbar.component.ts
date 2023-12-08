import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../message-box/message-box.component.css']
})
export class NavbarComponent {
  // COMPONENT INPUTS
  @Input() user: any;

  // COMPONENT OUTPUTS
  @Output() showConversations: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setLanguage: EventEmitter<object> = new EventEmitter<object>()
  @Output() showChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showSettings: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() profileClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
  ) { }

  /** PUBLIC METHODS */
  public logout(): void {
    this.authService.logout();
  }
}
