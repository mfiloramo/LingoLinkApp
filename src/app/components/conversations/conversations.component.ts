import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Conversation } from '../../../interfaces/Conversation.interfaces';
import { ConversationService } from '../../services/conversation/conversation.service';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { User } from "../../../interfaces/User.interfaces";

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
})
export class ConversationsComponent implements OnInit, OnDestroy {
  @Input() user: any;
  @Output() conversationSelected: EventEmitter<Conversation | null> = new EventEmitter();

  public conversations: Conversation[] = [];
  public isLoading: boolean = false;
  public selectedConversation: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private conversationService: ConversationService,
    private http: HttpClient
  ) { }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.loadConversations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** PUBLIC METHODS */
  public loadConversations(): void {
    this.isLoading = true;
    this.conversationService.loadConversationsByUserId(this.user.user_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (conversations: Conversation[]): Promise<void> => {
          // STUB: ASSIGN RANDOMLY GENERATED PROFILE PIC TO EACH CONVERSATION
          for (const conversation of conversations) {
            try {
              const pic: any = await this.http.get('https://randomuser.me/api/').toPromise();
              conversation.profileImageSrc = pic.results[0].picture.large;
            } catch (error) {
              console.error('Error loading profile image:', error);
              conversation.profileImageSrc = 'default_image_url'; // STUB
            }
          }
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
    this.conversationSelected.emit(conversation);
    this.selectedConversation = conversation;
  }

  public deselectConversation(): void {
    this.conversationSelected.emit(null);
    this.selectedConversation = null;
  }

  public checkConvoVisibility(conversation: Conversation): boolean {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);
    // INDICATE IF CONVERSATION KEY IS CACHED IN LOCALSTORAGE; DISPLAY ACCORDINGLY
    // return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
    return true;
  }

  public async deleteConversation(userId: User, conversation: number): Promise<any> {
    // MARK CONVERSATION AS DISABLED (INVISIBLE) IN LOCAL CACHE
    // const conversationKey: string = this.convertToConvoKey(conversation.name);
    // localStorage.setItem(conversationKey, 'disabled');

    // REMOVE USER AS PARTICIPANT IN SELECTED CONVERSATION
    // @ts-ignore
    await this.conversationService.deleteConversation(userId.user_id, conversation)
      .subscribe((response: any): void => {
        // RETURN SUCCESS/ERROR RESPONSE TO USER
        return response;
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
}