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

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    // DEBUG: STUB USER DATA ON MODULE INITIALIZATION
    const user_Id: number = Math.floor(Math.random() * 3) + 1;
    this.user = {
      user_id: user_Id,
      username: `testUser`,
      email: 'test@email.com',
      password: 'testPassword'
    }
    // DEBUG: DOES THE SERVER ACTUALLY CHECK FOR THE ABOVE CREDS?
    console.log(`Your User ID is: ${ user_Id }`);
  }

  /** PUBLIC METHODS */
  public onProfileClick(): void {
    this.fadeOutConvos = true;
    setTimeout((): void => {
      this.showConvos = false;
      this.fadeOutConvos = false;
    }, 300);
  }

  public onConversationSelected(conversation: any): void {
    this.selectedConversation = conversation;
    this.showChat = !this.showChat;
  }

  public onShowConversations(): void {
    this.showConvos = !this.showConvos;
  }

  public onShowChatBox(): void {
    this.showChat = !this.showChat;
  }
}
