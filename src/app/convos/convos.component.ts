import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Conversation } from '../../interfaces/conversationInterfaces';
import { ConversationService } from './conversation.service';
import dayjs from 'dayjs';
import { BrowserAuthError } from '@azure/msal-browser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('300ms ease-in')),
    ]),
    trigger('fadeOut', [
      state('void', style({ opacity: 0 })),
      transition(':leave', animate('300ms ease-out')),
    ]),
  ]
})
export class ConvosComponent implements OnInit {
  @Input() user: any;
  @Output() conversationSelected = new EventEmitter<any>();
  public conversations: any[] = [];

  constructor(
    private conversationService: ConversationService,
    private authService: AuthService
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

  /** UTILITY FUNCTIONS */
  public convertIsoString(isoString: string): string {
    return dayjs(isoString).format('MM/DD/YYYY');
  }

  private convertToConvoKey(conversationName: string): string {
    return `${conversationName}_vis`;
  }
}
