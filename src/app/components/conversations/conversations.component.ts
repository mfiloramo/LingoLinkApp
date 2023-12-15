import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output, ViewChild, ElementRef, AfterViewChecked, AfterViewInit,
} from '@angular/core';
import { Conversation } from '../../../interfaces/Conversation.interfaces';
import { ConversationService } from '../../services/conversation/conversation.service';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from "../../../interfaces/User.interfaces";
import { UserService } from "../../services/user/user.service";

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
  public selectedConversation: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private conversationService: ConversationService,
    private userService: UserService
  ) { }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.userState = this.userService.userState();
    this.loadConversations();
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
}
