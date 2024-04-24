import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import ShortUniqueId from "short-unique-id";
import { UserService } from "../../services/user/user.service";
import { ConversationService } from "../../services/conversation/conversation.service";
import { MatIconModule } from "@angular/material/icon";
import { TitleComponent } from "../title/title.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, TitleComponent ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css', '../../components/title/title.component.css']
})
export class ContactsComponent {
  public stubContacts: string[] = [ 'TestUser_1', 'TestUser_2', 'TestUser_3','Filoramo', 'show_user_1', 'show_user_2', 'show_user_3', 'show_user_4', 'show_user_5', 'show_user_6' ];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar, // TODO: IMPLEMENT SNACKBAR
    private userService: UserService,
    private conversationService: ConversationService,
  ) {}

  /** PUBLIC METHODS */
  public selectContactToChat(username: any): void {
    // SET CONVERSATION RECIPIENT USERNAME
    const selectedUsername: string = username.target.innerText
    this.conversationService.userSelected.set(selectedUsername);

    try {
      // CREATE NEW CONVERSATION UNIQUE ID
      const newConversationName: string = new ShortUniqueId({ length: 10 }).rnd()

      // CACHE CONVERSATION DATA BEFORE STARTING CONVERSATION
      const cachedConversation: any = {
        StarterUsername: this.userService.userState().StarterUsername,
        StarterUserPic: this.userService.userState().StarterUserPic,
        recipientUsername: this.conversationService.userSelected(),
        conversationName: newConversationName,
      }

      // SET CACHED CONVERSATION IN CONVERSATION SERVICE
      this.conversationService.isNewConversation.set(true);
      this.conversationService.conversationSelected.set(cachedConversation);
    } catch (error: any) {
      console.error('Error starting new conversation: ', error);
    } finally {
      this.router.navigate(['home/chat'])
        .then((response: any) => response);
    }
  }
}
