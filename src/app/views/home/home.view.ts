import { Component, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { ConversationService } from "../../services/conversation/conversation.service";
import { MessageService } from "../../services/message/message.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import ShortUniqueId from "short-unique-id";

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrls: ['./home.view.css']
})
export class HomeView implements OnInit, OnDestroy {
  // COMPONENT INPUTS
  @Input() user: any;

  // COMPONENT OUTPUTS
  @Output() public selectedConversation!: any;

  // COMPONENT STATE
  public sourceLanguage: any = 'en';
  public showConvos: boolean = true;
  public showChat: boolean = false;
  public showModal: boolean = false;
  public showSettings: boolean = false;
  public modalAnimationClass: string = '';
  public newConversationForm!: FormGroup;
  public newConversationCache!: any;
  public isInitialMessageSent: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) {
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    console.log('home.view.sourceLanguage:', this.sourceLanguage);
    this.subscriptions.add(
      this.authService.currentUser$
        .subscribe((user: any): void => this.user = user)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** PUBLIC METHODS */
  public onProfileClick(): void {
    this.showChat = true;
    this.showConvos = false;
    this.showSettings = false;
    this.showConvos = false;
  }

  public onConversationSelected(conversation: any): void {
    conversation.StarterUsername = conversation.StarterUsername || this.user.username;
    conversation.StarterUserPic = conversation.StarterUserPic || this.user.userPic;

    this.selectedConversation = conversation;
    this.showChat = true;
    this.showConvos = false;
    this.showSettings = false;
  }

  public onConversationDeselected(): void {
    this.selectedConversation = null;
    this.showChat = false;
    this.showConvos = true;
    this.showSettings = false;
  }

  public onShowConversations(): void {
    this.showConvos = true;
    this.showChat = false;
    this.showSettings = false;
  }

  public onShowChatBox(): void {
    this.showChat = true;
    this.showConvos = false;
    this.showSettings = false;
  }

  public onShowSettings(): void {
    this.showChat = false;
    this.showConvos = false;
    this.showSettings = true;
  }

  public async onNewConversationFormSubmit(recipientUsername: string): Promise<void> {
    try {
      // GENERATE NEW CONVERSATION GUID
      const conversationName: string = new ShortUniqueId({ length: 10 }).rnd();

      // CACHE CONVERSATION DATA
      if (recipientUsername) this.newConversationCache = { recipientUsername, conversationName };

      // SWITCH VIEWS TO CHAT-BOX
      this.onShowChatBox();
      this.toggleModal();
    } catch (error: any) {
      console.error(error);
    }
  }

  public async onNewConversationMsgSubmit(messageToSend: string): Promise<void> {
    if (this.isInitialMessageSent) return;

    // CHECK IF A CONVERSATION NEEDS TO BE STARTED
    if (this.newConversationCache && messageToSend && !this.isInitialMessageSent) {
      try {
        // CREATE THE NEW CONVERSATION
        let newConversation = await this.conversationService.createConversation({
          recipientUsername: this.newConversationCache.recipientUsername,
          conversationName: this.newConversationCache.conversationName,
          sourceLanguage: this.sourceLanguage,
          senderUserId: this.user.user_id,
          timestamp: new Date().toISOString()
        }).toPromise();

        if (newConversation) {
          this.selectedConversation = newConversation;
          this.messageService.sendMessage({
            conversationId: newConversation.conversation_id,
            user_id: this.user.user_id,
            textInput: messageToSend,
            source_language: this.sourceLanguage,
            timestamp: new Date().toISOString(),
          })
            .subscribe((response: any): void => {
              this.isInitialMessageSent = true;
              return response;
            }, (error: any): void => {
              console.error(error);
            });
        }
      } catch (error: any) {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      }
    }
  }

  public onLanguageSelect(language: any): void {
    this.sourceLanguage = language;
  }

  public resetInitialMessageFlag(): void {
    this.isInitialMessageSent = false;
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
      // this.newConversationForm.reset();
      this.showModal = false;
    }
  }

  /** PRIVATE METHODS */
  private buildNewConversationForm(): void {
    this.newConversationForm = this.fb.group({
      recipientUsername: [ '' ],
      conversationName: [ '' ],
      sourceLanguage: [ '' ],
      senderUserId: [ '' ],
      timestamp: [ '' ],
    })
  }
}
