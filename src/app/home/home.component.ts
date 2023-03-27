import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() user: any;
  public selectedConversation: any;

  constructor() { }

  ngOnInit(): void {
  }

  public onConversationSelected(conversation: any) {
    this.selectedConversation = conversation;
  }
}
