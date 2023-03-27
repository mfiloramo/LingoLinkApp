import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConversationService } from "./conversation.service";

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css']
})
export class ConvosComponent implements OnInit {
  @Input() user: any;
  @Output() conversationSelected = new EventEmitter<any>();

  public conversations: any[] = [];

  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    // POPULATE MOCKDATA WITH CONVERSATIONS MATCHING USERID
    this.conversationService.loadConversationsByUserId(14).subscribe((response: any) => {
      this.conversations = response;
    })
  }

  public onSelectConversation(conversation: any) {
    this.conversationSelected.emit(conversation);
  }
}
