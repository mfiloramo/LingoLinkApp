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
  public showConvos: boolean = true; // Defaulted to true to show conversations on init
  public showChat: boolean = false;
  public showModal: boolean = false;
  public modalAnimationClass: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** PUBLIC METHODS */
  public onProfileClick(): void {
    // No need for fadeOutConvos if we are not visually transitioning
    this.showConvos = false;
  }

  public onConversationSelected(conversation: any): void {
    this.selectedConversation = conversation;
    this.showChat = true; // Directly setting to true as we know we want to show the chat
    this.showConvos = false; // Hide conversations when a chat is selected
  }

  public onShowConversations(): void {
    this.showConvos = true;
    this.showChat = false; // Hide chat when showing conversations
  }

  public onShowChatBox(): void {
    this.showChat = true;
  }

  toggleModal() {
    if (!this.showModal) {
      // When opening the modal
      this.showModal = true;
      this.modalAnimationClass = 'modal-animate-in';
    } else {
      // When closing the modal
      this.modalAnimationClass = 'modal-animate-out';
      setTimeout(() => {
        this.showModal = false;
      }, 400); // Duration of the animation
    }
  }
}
