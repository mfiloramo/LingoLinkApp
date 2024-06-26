import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import dayjs from 'dayjs';
import { UserService } from "../../services/user/user.service";
import { ConversationService } from '../../services/conversation/conversation.service';
import { Conversation } from '../../../interfaces/Conversation.interfaces';
import { User } from "../../../interfaces/User.interfaces";

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('conversationList') conversationList!: ElementRef<any>;
  public userState!: User;
  public conversations: Conversation[] = [];
  public isLoading: boolean = false;
  public sourceLanguage: any;
  public newConversationForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private conversationService: ConversationService,
  ) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.loadConversations();
    this.buildNewConversationForm();
  }

  public ngAfterViewChecked(): void { this.scrollToTop();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** PUBLIC METHODS */
  public loadConversations(): void {
    this.isLoading = true;
    this.conversationService.loadConversationsByUserId(this.userService.userState().userId)
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
    this.conversationService.updateConversation(conversation);
    this.router.navigate(['home/chat']).then((response: any) => response);
  }

  public onCreateNewConversation(): void {
    this.router.navigate(['home/contacts'])
      .then((response: any) => response);
  }

  public checkConversationVisibility(conversation: Conversation): boolean {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: any = this.convertToConvoKey(conversation.conversationName);
    // INDICATE IF CONVERSATION KEY IS CACHED IN LOCALSTORAGE; DISPLAY ACCORDINGLY
    return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
  }

  public async removeConversation(user: User, conversation: Conversation): Promise<any> {
    // MARK CONVERSATION AS DISABLED (INVISIBLE) IN LOCAL CACHE
    const conversationKey: string = this.convertToConvoKey(conversation.conversationName);
    localStorage.setItem(conversationKey, 'disabled');

    // REMOVE USER AS PARTICIPANT IN SELECTED CONVERSATION
    await this.conversationService.deleteConversation(this.userService.userState().userId, conversation)
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
  public convertIsoString(isoString: string | undefined): string {
    return dayjs(isoString).format('MM/DD/YYYY');
  }

  public convertToConvoKey(conversationName: any): string {
    return `${ conversationName }_vis`;
  }

  public truncateSentence(sentence: any, maxLength: number): string {
    return sentence.length > maxLength ? sentence.slice(0, maxLength - 3) + '...' : sentence;
  }

  public scrollToTop(): void {
    this.conversationList.nativeElement.scrollTop = 0;
  }
}
