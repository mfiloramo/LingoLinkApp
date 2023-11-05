import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { Conversation } from "../../../interfaces/Conversation.interfaces";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() user: any;
  public selectedConversation: any;
  // SET DEFAULT VIEW BY CHANGING ANY ONE SLICE OF STATE TO TRUE FOR show-- PROPS
  public showConvos: boolean = true;
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
    this.showConvos = false;
  }

  public onConversationSelected(conversation: any): void {
    this.selectedConversation = conversation;
    this.showChat = true;
    this.showConvos = false;
  }

  public onDeselectConversation(): void {
    this.selectedConversation = null;
    this.showChat = false;
    this.showConvos = true;
  }

  public onShowConversations(): void {
    this.showConvos = true;
    this.showChat = false;
  }

  public onShowChatBox(): void {
    this.showChat = true;
    this.showConvos = false;
  }

  public toggleModal(): void {
    if (!this.showModal) {
      // WHEN OPENING THE MODAL
      this.showModal = true;
      this.modalAnimationClass = 'modal-animate-in';
    } else {
      // WHEN CLOSING THE MODAL
      this.modalAnimationClass = 'modal-animate-out';
      setTimeout(() => {
        this.showModal = false;
      }, 400); // DURATION OF ANIMATION
    }
  }
}
