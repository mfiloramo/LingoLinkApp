import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() user: any;
  public selectedConversation: any;
  public showConvos: boolean = false;
  public showChat: boolean = false;
  public fadeOutConvos: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user): void => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
