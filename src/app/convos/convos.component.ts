import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '../../interfaces/conversation.interfaces';
import { ConversationService } from './conversation.service';
import dayjs from 'dayjs';
import { BrowserAuthError } from '@azure/msal-browser';

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css'],
})
export class ConvosComponent implements OnInit {
  @Input() user: any;
  @Output() conversationSelected = new EventEmitter<any>();
  public conversations: any[] = [];

  constructor(
    private conversationService: ConversationService,
    private http: HttpClient
  ) { }

  /** LIFECYCLE HOOKS */
  async ngOnInit(): Promise<any> {
    // DEBUG: IDENTIFY USER
    // console.log(`Debug: user ${this.user.user_id}`);

    // LOAD CONVERSATIONS BY USERID
    try {
      this.conversations = await this.conversationService.loadConversationsByUserId(this.user.user_id);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // handle the specific error message
      if (error instanceof BrowserAuthError && error.errorCode === 'no_account_error') {
        // perform some action or show a message to the user to indicate that they need to log in again
      }
    }

    // TODO: AFTER THE CONVERSATIONS LOAD, BUT BEFORE THEY'RE ADDED TO THE DOM, ITERATE THROUGH AND CALL THE SP ON EACH CONVERSATION USING THE APPROPRIATE SERVICE THAT CALLS IT (CONVERSATION SERVICE?). AND RENDERING EACH TRAIT.
  }

  /** PUBLIC METHODS */
  public onSelectConversation(conversation: Conversation): void {
    // EMIT SELECTED CONVERSATION
    this.conversationSelected.emit(conversation);
  }

  public checkConvoVisibility(conversation: Conversation): boolean {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);

    // INDICATE IF CONVERSATION KEY IS CACHED IN LOCALSTORAGE; DISPLAY ACCORDINGLY
    return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
  }

  public removeConvo(conversation: Conversation): void {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);

    // SET SELECTED CONVERSATION TO "DISABLED" IN LOCALSTORAGE CACHE
    localStorage.setItem(conversationKey, 'disabled');
  }

  public truncateSentence(sentence: string, maxLength: number): string {
    return sentence.length > maxLength ? sentence.slice(0, maxLength - 3) + '...' : sentence;
  }

  /** UTILITY FUNCTIONS */
  public convertIsoString(isoString: string): string {
    return dayjs(isoString).format('MM/DD/YYYY');
  }

  private convertToConvoKey(conversationName: string): string {
    return `${conversationName}_vis`;
  }
}
