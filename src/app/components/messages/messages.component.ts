import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { catchError, switchMap } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { TranslationService } from '../../services/translation/translation.service';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { UserService } from "../../services/user/user.service";
import { ConversationService } from "../../services/conversation/conversation.service";
import { MessageService } from '../../services/message/message.service';
import { ChatMessage } from "../../../interfaces/Message.interfaces";
import { Conversation } from "../../../interfaces/Conversation.interfaces";
import languageArray from '../../../utils/languageMapper';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Message } from "postcss";


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css', '../conversations/conversations.component.css', '../title/title.component.css'],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  // COMPONENT CHILDREN
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  // COMPONENT STATE
  public messagesContainer: ChatMessage[] = [];
  public languageArray: any[] = languageArray;
  public textInput: string = '';
  public audio: any = new Audio();
  public isLoading: boolean = false;
  public conversationStarterName!: string;
  public conversationStarterPic!: string;
  public languageSelectorStyling: object = { 'background-color': '#989aad', 'width': '100px', 'height': '35px', 'font-size': '16px' };


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    public userService: UserService,
  ) {
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    // SET CONVERSATION METADATA
    this.conversationStarterName = this.conversationService.conversationSelected().StarterUsername;
    this.conversationStarterPic = this.conversationService.conversationSelected().StarterUserPic;

    // LOAD MESSAGES BY CONVERSATION ID
    if (!this.conversationService.isNewConversation()) {
      this.loadMessagesByConversationId(this.conversationService.conversationSelected().conversationId).then((response: any) => response)
    }

    // CONNECT WEBSOCKET
    this.connectWebSocket();
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /** PUBLIC METHODS */
  public buildConversationPayload(): Conversation {
    return {
      recipientUsername: this.conversationService.conversationSelected().recipientUsername,
      conversationName: this.conversationService.conversationSelected().conversationName,
      sourceLanguage: this.userService.userState().defaultLanguage,
      senderUserId: this.userService.userState().userId,
      timestamp: new Date().toISOString(),
    }
  }

  public buildMessage(): ChatMessage {
    return this.messageService.buildMessage({
      userId: this.userService.userState().userId,
      textInput: this.textInput,
      conversationId: this.conversationService.conversationSelected().conversationId,
      sourceLanguage: this.userService.userState().defaultLanguage,
    });
  }

  public checkIfExistingConversation(): void {
    // CHECK IF CONVERSATION EXISTS AND ROUTE MESSAGE ACCORDINGLY
    this.conversationService.isNewConversation()
      ? this.sendMessageNewConversation()
      : this.sendMessageExistingConversation()
  }

  public sendMessageNewConversation(): void {
    try {
      // CHECK FOR EMPTY INPUT
      if (!this.textInput) return;

      // BUILD CONVERSATION OBJECT FOR HTTP REQUEST
      const newConversationPayload: any = this.buildConversationPayload();

      // CREATE NEW CONVERSATION AND DERIVE NEW CONVERSATION ID
      this.conversationService.createConversation(newConversationPayload)
        .subscribe({
          next: (response: any): void => {
            // UPDATE CONVERSATION WITH NEWLY GENERATED CONVERSATION ID
            const updatedConversationState: Conversation = { conversationId: response.conversationId }
            this.conversationService.updateConversation(updatedConversationState);

            // BUILD MESSAGE OBJECT FOR HTTP REQUEST
            const message: any = this.buildMessage()

            // SEND MESSAGE TO CONVERSATION
            this.sendMessage(message);

            // RESET NEW CONVERSATION FLAG
            this.conversationService.isNewConversation.set(false);

          },
          error: (error: any): void => {
            this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
          }
        })
    } catch (error: any) {
      console.error(error);
    }
  }

  public sendMessageExistingConversation(): void {
    // CHECK FOR EMPTY INPUT
    if (!this.textInput) return;

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: any = this.buildMessage()

    // SEND MESSAGE TO CONVERSATION
    this.sendMessage(message);
  }

  public sendMessage(message: ChatMessage): void {
    if (this.conversationService.conversationSelected()) {
      // SEND MESSAGE TO CONVERSATION
      this.messageService.sendMessage(message).pipe(
        switchMap((response: any) => {
          this.webSocketService.send(message);
          return of(response);
        }),
        catchError((error) => {
          console.error('Failed to send message:', error);
          return of({ error: true });
        })
      ).subscribe((response: any): void => {
        if (response && !response.error) {
          this.messagesContainer.push(message);
          this.textInput = '';
          this.playClickSound();
        } else {
          console.error('Error sending message');
        }
      });
    } else {
      this.textInput = '';
    }
  }

  public async loadMessagesByConversationId(conversationId: number): Promise<void> {
    if (!this.conversationService.conversationSelected()) return;

    this.isLoading = true;

    try {
      const response: any = await this.messageService.loadMessages(conversationId).toPromise();
      const messages: ChatMessage[] = response;

      // TRANSLATE ALL MESSAGES ASYNCHRONOUSLY AND WAIT FOR ALL TO COMPLETE
      const translationPromises: Promise<string>[] = messages.map((message: ChatMessage): Promise<string> =>
        message.sourceLanguage !== this.userService.userState().defaultLanguage
          ? this.cacheCheckTranslation(message)
          : Promise.resolve(message.textInput)
      );

      const translatedTexts: any = await Promise.all(translationPromises);

      // ASSIGN TRANSLATED TEXTS BACK TO MESSAGES
      messages.forEach((message: ChatMessage, index: number) => message.textInput = translatedTexts[index]);

      this.messagesContainer = messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  public onDeselectConversation(): void {
    this.conversationService.conversationSelected.set(null);
    this.conversationService.isNewConversation.set(false);
    this.router.navigate(['/home/conversations']).then((response: any) => response);
    this.webSocketService.disconnect();
  }

  /** PRIVATE METHODS */
  private connectWebSocket(): void {
    // CONNECT TO WEBSOCKET VIA NG SERVICE
    this.webSocketService.connect();

    // LISTEN FOR INCOMING MESSAGES OVER WEBSOCKET CONNECTION
    this.webSocketService.onMessage()
      .subscribe((event: any): void => {

        // PARSE INCOMING MESSAGE
        const reader: FileReader = new FileReader();
        reader.onload = async (): Promise<void> => {
          const message = JSON.parse(reader.result as string);
          const sourceLanguage: string = message.sourceLanguage;
          const targetLanguage: string = this.userService.userState().defaultLanguage;

          // TRANSLATE MESSAGE IF NEEDED
          if (sourceLanguage !== targetLanguage) {
            message.textInput = await this.translationService.getLiveTranslation({
              user: this.userService.userState().userId,
              textInput: message.textInput,
              sourceLanguage: sourceLanguage,
              targetLanguage: targetLanguage
            }).toPromise();
          }

            // PUSH MESSAGE TO SELECTED CONVERSATION
            if (message.conversationId === this.conversationService.conversationSelected().conversationId) {
              this.messagesContainer.push(message);
            }

        };

        reader.readAsText(event.data);
      });
  }

  private async cacheCheckTranslation(message: ChatMessage): Promise<string> {
    try {
      const translateKey: string = `${ message.messageId }_${ this.userService.userState().defaultLanguage }`;
      let storedTranslation: string | null = this.translationService.getStoredTranslation(translateKey);

      if (!storedTranslation) {
        storedTranslation = await firstValueFrom(this.translationService.getLiveTranslation({
          user: this.userService.userState().userId,
          textInput: message.textInput,
          sourceLanguage: message.sourceLanguage,
          targetLanguage: this.userService.userState().defaultLanguage
        }))
          .then((response: string): string => {
            this.translationService.storeTranslation(translateKey, response);
            return response;
        });
      }

      return storedTranslation!;
    } catch (error) {
      console.error('Error in cacheCheckTranslation:', error);
      return message.textInput;
    }
  }

  /** UTILITY FUNCTIONS */
  private scrollToBottom(): void {
    const element: HTMLInputElement = this.chatContainer.nativeElement;
    element.scrollIntoView({ block: 'end' });
  }

  private playClickSound(): void {
    // this.audio.load();
    // this.audio.play();
    return;
  }
}
