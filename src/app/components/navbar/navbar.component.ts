import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() user: any;
  @Output() showConversations = new EventEmitter<boolean>();
  @Output() showChat = new EventEmitter<boolean>();
  @Output() profileClick = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
  ) {}

  /** PUBLIC METHODS */
  public showChatBox(): void {
    this.showChat.emit(true);
  }

  public logout(): void {
    this.authService.logout();
  }
}
