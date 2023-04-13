import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Conversation } from "../../interfaces/conversationInterface";
import { ConversationService } from "./conversation.service";
import dayjs from "dayjs";

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

  constructor(private conversationService: ConversationService) { }

  /** LIFECYCLE HOOKS */
  async ngOnInit(): Promise<any> {
    // DEBUG
    console.log(this.user.user_id)

    this.conversationService.loadConversationsByUserId(this.user.user_id)
      .subscribe((response: any) => {
        this.conversations = response;
      });
  }

  /** PUBLIC METHODS */
  public onSelectConversation(conversation: Conversation): void {
    this.conversationSelected.emit(conversation);
  }

  public checkConvoVisibility(conversation: Conversation): boolean {
    const conversationKey: string = this.convertToConvoKey(conversation.name);
    return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
  }

  public removeConvo(conversation: Conversation): void {
    const conversationKey: string = this.convertToConvoKey(conversation.name);
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
