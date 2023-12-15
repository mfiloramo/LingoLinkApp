import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import ShortUniqueId from "short-unique-id";

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrls: ['./home.view.css']
})
export class HomeView {
  // COMPONENT STATE
  public sourceLanguage: any = 'en';
  public modalAnimationClass: string = '';
  public newConversationForm: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public toggleModal(): void {
    // WHEN OPENING THE MODAL
    this.modalAnimationClass = 'modal-animate-in';
    this.buildNewConversationForm();

    // WHEN CLOSING THE MODAL
    this.modalAnimationClass = 'modal-animate-out';
  }

  // MOVE TO CONVERSATIONS MODULE
  public async onNewConversationFormSubmit(recipientUsername: string): Promise<void> {
    try {
      // GENERATE NEW CONVERSATION GUID
      const conversationName: string = new ShortUniqueId({ length: 10 }).rnd();

      // CACHE CONVERSATION DATA
      // if (recipientUsername) this.newConversationCache = { recipientUsername, conversationName };

      // SWITCH VIEWS TO CHAT-BOX
      this.toggleModal();
    } catch (error: any) {
      console.error(error);
    }
  }

  // MOVE TO CONVERSATIONS MODULE
  // public async onNewConversationMsgSubmit(messageToSend: string): Promise<void> {
  //   if (this.isInitialMessageSent) return;
  //
  //   // CHECK IF A CONVERSATION NEEDS TO BE STARTED
  //   if (this.newConversationCache && messageToSend && !this.isInitialMessageSent) {
  //     try {
  //       // CREATE THE NEW CONVERSATION
  //       let newConversation = await this.conversationService.createConversation({
  //         recipientUsername: this.newConversationCache.recipientUsername,
  //         conversationName: this.newConversationCache.conversationName,
  //         sourceLanguage: this.sourceLanguage,
  //         senderUserId: this.user.userId,
  //         timestamp: new Date().toISOString()
  //       }).toPromise();
  //
  //       if (newConversation) {
  //         this.selectedConversation = newConversation;
  //         this.messageService.sendMessage({
  //           conversationId: newConversation.conversationId,
  //           userId: this.user.userId,
  //           textInput: messageToSend,
  //           sourceLanguage: this.sourceLanguage,
  //           timestamp: new Date().toISOString(),
  //         })
  //           .subscribe((response: any): void => {
  //             this.isInitialMessageSent = true;
  //             return response;
  //           }, (error: any): void => {
  //             console.error(error);
  //           });
  //       }
  //     } catch (error: any) {
  //       this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
  //     }
  //   }
  // }

  /** PRIVATE METHODS */
  // MOVE TO CONVERSATIONS MODULE
  private buildNewConversationForm(): void {
    this.newConversationForm = this.fb.group({
      recipientUsername: [ '' ],
      conversationName: [ '' ],
      sourceLanguage: [ '' ],
      senderUserId: [ '' ],
      timestamp: [ '' ],
    })
  }
}
