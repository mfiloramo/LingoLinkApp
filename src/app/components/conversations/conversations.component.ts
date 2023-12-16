import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ShortUniqueId from "short-unique-id";
import dayjs from 'dayjs';
import { UserService } from "../../services/user/user.service";
import { ConversationService } from '../../services/conversation/conversation.service';
import { MessageService } from "../../services/message/message.service";
import { Conversation } from '../../../interfaces/Conversation.interfaces';
import { User } from "../../../interfaces/User.interfaces";

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('conversationList') conversationList!: ElementRef<any>;
  public userState!: User;
  public conversations: Conversation[] = [];
  public isLoading: boolean = false;
  public sourceLanguage: any;
  public selectedConversation: any;
  public modalAnimationClass: string = '';
  public newConversationForm!: FormGroup;
  public newConversationCache!: any;
  public isInitialMessageSent: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.userState = this.userService.userState();
    this.loadConversations();
    this.buildNewConversationForm();
  }

  ngAfterViewChecked(): void {
    this.scrollToTop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** PUBLIC METHODS */
  public loadConversations(): void {
    this.isLoading = true;
    this.conversationService.loadConversationsByUserId(this.userState.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (conversations: Conversation[]): Promise<void> => {
          this.conversations = conversations;
          this.isLoading = false;
        },
        error: (error: any): void => {
          console.error('Error loading conversations:', error);
          this.isLoading = false;
        }
      });
  }

  public onSelectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
  }

  public async onNewConversationFormSubmit(recipientUsername: string): Promise<void> {
    try {
      // GENERATE NEW CONVERSATION GUID
      const conversationName: string = new ShortUniqueId({ length: 10 }).rnd();

      // SWITCH VIEWS TO CHAT-BOX
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
          sourceLanguage: this.userState.sourceLanguage,
          senderUserId: this.userState.userId,
          timestamp: new Date().toISOString()
        }).toPromise();

        if (newConversation) {
          this.selectedConversation = newConversation;
          this.messageService.sendMessage({
            conversationId: newConversation.conversationId,
            userId: this.userState.userId,
            textInput: messageToSend,
            sourceLanguage: this.sourceLanguage,
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

  public checkConversationVisibility(conversation: Conversation): boolean {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);
    // INDICATE IF CONVERSATION KEY IS CACHED IN LOCALSTORAGE; DISPLAY ACCORDINGLY
    return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
  }

  public async removeConversation(user: User, conversation: Conversation): Promise<any> {
    // MARK CONVERSATION AS DISABLED (INVISIBLE) IN LOCAL CACHE
    const conversationKey: string = this.convertToConvoKey(conversation.name);
    localStorage.setItem(conversationKey, 'disabled');

    // REMOVE USER AS PARTICIPANT IN SELECTED CONVERSATION
    await this.conversationService.deleteConversation(user.userId, conversation)
      .subscribe((response: any): void => response);
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

  /** UTILITY FUNCTIONS */
  public convertIsoString(isoString: string): string {
    return dayjs(isoString).format('MM/DD/YYYY');
  }

  private convertToConvoKey(conversationName: string): string {
    return `${ conversationName }_vis`;
  }

  public truncateSentence(sentence: string, maxLength: number): string {
    return sentence.length > maxLength ? sentence.slice(0, maxLength - 3) + '...' : sentence;
  }

  public scrollToTop(): void {
    this.conversationList.nativeElement.scrollTop = 0;
  }

  public toggleModal(): void {
    // WHEN OPENING THE MODAL
    this.modalAnimationClass = 'modal-animate-in';

    // WHEN CLOSING THE MODAL
    this.modalAnimationClass = 'modal-animate-out';
  }


}
