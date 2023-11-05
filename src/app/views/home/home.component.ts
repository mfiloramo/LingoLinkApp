import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { ConversationService } from "../../services/conversation/conversation.service";
import { MessageService } from "../../services/message/message.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

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
  public newConversationForm!: FormGroup;
  public newConversationCache!: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

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

  public onConversationDeselected(): void {
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

  public async onNewConversationFormSubmit(recipientEmail: string, conversationName: string): Promise<void> {
    // CACHE CONVERSATION DATA
    if (recipientEmail && conversationName) {
      this.newConversationCache = { recipientEmail, conversationName };
    }

    // SWITCH VIEWS TO CHAT-BOX
    this.onShowChatBox();
    this.toggleModal();
    // await this.router.navigate(['/chat']);
    return;
  }

  public async onNewConversationMsgSubmit(stubMessage: string): Promise<void> {
    // Check if a new conversation needs to be started
    if (this.newConversationCache && stubMessage) {
      try {
        // First, create a conversation
        let newConversation = await this.conversationService.createConversation({
          recipientEmail: this.newConversationCache.recipientEmail,
          conversationName: this.newConversationCache.conversationName,
          sourceLanguage: 'en',
          senderUserId: this.user.user_id,
          timestamp: new Date().toISOString()
        }).toPromise();

        // Now that the conversation is created, send the first message
        if (newConversation) {
          this.selectedConversation = newConversation.newConversationId; // Assign the new conversation
          // this.selectedConversation = { conversation_id: newConversation }; // IF CONVERSATION TYPE IS NEEDED
          this.messageService.sendMessage({
            conversationId: newConversation.NewConversationId,
            user_id: this.user.user_id,
            textInput: 'testing',
            source_language: 'en',
            timestamp: new Date().toISOString(),
          }).subscribe((response: any): void => {
            console.log('Message sent to the newly created conversation', response);
          }, error => {
            console.error('Failed to send message to the new conversation', error);
          });
        }
      } catch (error: any) {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      }
    }
  }

  public toggleModal(): void {
    if (!this.showModal) {
      // WHEN OPENING THE MODAL
      this.showModal = true;
      this.modalAnimationClass = 'modal-animate-in';
      this.buildNewConversationForm();
    } else {
      // WHEN CLOSING THE MODAL
      this.modalAnimationClass = 'modal-animate-out';
      this.newConversationForm.reset();
      setTimeout((): void => {
        this.showModal = false;
      }, 400); // DURATION OF ANIMATION
    }
  }

  /** PRIVATE METHODS */
  private buildNewConversationForm(): void {
    this.newConversationForm = this.fb.group({
      recipientEmail: [''],
      conversationName: [''],
      sourceLanguage: [''],
      senderUserId: [''],
      timestamp: [''],
    })
  }
}
