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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() user: any;
  @Output() public selectedConversation: any;
  // SET DEFAULT VIEW BY CHANGING ANY ONE SLICE OF STATE TO TRUE FOR show-- PROPS
  public sourceLanguage: string = 'en';
  public showConvos: boolean = true;
  public showChat: boolean = false;
  public showModal: boolean = false;
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

  public async onNewConversationFormSubmit(recipientEmail: string): Promise<void> {
    // GENERATE NEW CONVERSATION GUID
    const conversationName: string = new ShortUniqueId({ length: 10 }).rnd();

    // CACHE CONVERSATION DATA
    if (recipientEmail) this.newConversationCache = { recipientEmail, conversationName };

    // SWITCH VIEWS TO CHAT-BOX
    this.onShowChatBox();
    this.toggleModal();
  }

  public async onNewConversationMsgSubmit(messageToSend: string): Promise<void> {
    if (this.isInitialMessageSent) return;

    // CHECK IF A CONVERSATION NEEDS TO BE STARTED
    if (this.newConversationCache && messageToSend && !this.isInitialMessageSent) {
      try {
        // CREATE THE NEW CONVERSATION
        let newConversation = await this.conversationService.createConversation({
          recipientEmail: this.newConversationCache.recipientEmail,
          conversationName: this.newConversationCache.conversationName,
          sourceLanguage: this.sourceLanguage,
          senderUserId: this.user.user_id,
          timestamp: new Date().toISOString()
        }).toPromise();

        // SEND FIRST MESSAGE IN THE NEW CONVERSATION
        if (newConversation) {
          this.selectedConversation = newConversation;
          await this.messageService.sendMessage({
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
      recipientEmail: [''],
      conversationName: [''],
      sourceLanguage: [''],
      senderUserId: [''],
      timestamp: [''],
    })
  }
}
