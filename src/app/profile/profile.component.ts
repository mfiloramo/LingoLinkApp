import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() user: any;
  @Output() showConvosAndChatEvent = new EventEmitter<boolean>();
  @Output() profileClick = new EventEmitter<void>();


  public showConvosAndChat(): void {
    this.showConvosAndChatEvent.emit(true);
  }
}
