import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() user: any;
  @Output() showConvosAndChatEvent = new EventEmitter<boolean>();
  @Output() profileClick = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
  ) {}

  public showConvosAndChat(): void {
    this.showConvosAndChatEvent.emit(true);
  }

  public logout(): void {
    this.authService.logout();
  }
}
