import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import ShortUniqueId from "short-unique-id";
import { UserService } from "../../services/user/user.service";
import { ConversationService } from "../../services/conversation/conversation.service";
import { User } from "../../../interfaces/User.interfaces";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  public stubContacts: Array<string> = [ 'TestUser_1', 'TestUser_2', 'TestUser_3', 'TestUser_4' ]
  public userState!: User;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private conversationService: ConversationService,
  ) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.userState = this.userService.userState();
  }

  /** PUBLIC METOHDS */
  public async stubOnContactClick(contact: any): Promise<void> {
    this.conversationService.isNewConversation.set(true);

    // TODO: DON'T CREATE CONVERSATION YET; CACHE FIRST IN SERVICE, THEN MAKE A MULTI-STEP TRANSACTION WITH CREATECONVO AND THEN SEND MESSAGE
    this.conversationService.createConversation({
      recipientUsername: contact.target.innerText,
      conversationName: new ShortUniqueId({ length: 10 }).rnd(),
      sourceLanguage: this.userService.userState().sourceLanguage,
      senderUserId: this.userState.userId,
      timestamp: new Date().toISOString()
    })
      .subscribe({
        next: (response: any): void => {
          this.conversationService.conversationSelected.set(response.conversationId);
          this.router.navigate([ 'home/chat' ]).then((response: any) => response);
        },
        error: (error: any): void => {
          this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        }
      });
  }
}
