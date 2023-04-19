import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() user: any;
  public selectedConversation: any;
  public showConvos: boolean = false;
  public showChat: boolean = false;
  public fadeOutConvos: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // DEBUG: STUB USER DATA ON APP INITIALIZATION
    const randomNumbers = [2, 6, 8, 9, 10, 11, 12, 13, 14, 15];
    const user_Id = Math.random() < 0.5 ? 14 : randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
    this.user = {
      user_id: user_Id,
      username: `testUser`,
      email: 'test@email.com',
      password: 'testPassword'
    }
  }

  onProfileClick() {
    this.fadeOutConvos = true;
    setTimeout(() => {
      this.showConvos = false;
      this.fadeOutConvos = false;
    }, 300);
  }

  public onConversationSelected(conversation: any) {
    this.selectedConversation = conversation;
    this.showChat = true;
  }

  public onShowConvosAndChat(): void {
    this.showConvos = true;
  }
}
