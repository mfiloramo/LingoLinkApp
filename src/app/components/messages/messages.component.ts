import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css', '../conversations/conversations.component.css'],
})
export class MessagesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  // COMPONENT CHILDREN
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  // COMPONENT STATE
  public messagesContainer: ChatMessage[] = [];
  public languageArray: any[] = languageArray;
  public textInput: string = '';
  public audio: any = new Audio();
  public isLoading: boolean = false;
  public conversationSelected!: Conversation;
  public conversationStarterName!: string;
  public conversationStarterPic!: string;


  constructor(
    private router: Router,
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
    this.conversationSelected = this.conversationService.conversationSelected();
    this.conversationStarterName = this.conversationSelected.StarterUsername;
    this.conversationStarterPic = this.conversationSelected.StarterUserPic;
    this.connectWebSocket();
    if (!this.conversationService.isNewConversation()) {
      this.loadMessagesByConvId(this.conversationSelected.conversationId).then((response: any) => response)
    }
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /** PUBLIC METHODS */
  public onSendMessage(): void {
    if (!this.textInput) return;

    let messageLanguage = this.userService.userState().defaultLanguage;

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: ChatMessage = this.messageService.buildMessage({
      userId: this.userService.userState().userId,
      textInput: this.textInput,
      conversationId: this.conversationService.conversationSelected().conversationId,
      sourceLanguage: messageLanguage,
    });

    if (this.conversationSelected) {
      // SEND MESSAGE TO EXISTING CONVERSATION
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
        } else {
          console.error('Error sending message');
        }
      });
    } else {
      this.textInput = '';
    }

    if (this.conversationService.isNewConversation()) {
      this.conversationService.isNewConversation.set(false);
    }

    this.playClickSound();
  }

  public async loadMessagesByConvId(conversationId: number): Promise<void> {
    if (!this.conversationSelected) return;

    this.isLoading = true;

    try {
      const response: any = await this.messageService.loadMessages(conversationId).toPromise();
      const messages: ChatMessage[] = response;

      // TRANSLATE ALL MESSAGES ASYNCHRONOUSLY AND WAIT FOR ALL TO COMPLETE
      const translationPromises = messages.map((message: ChatMessage): Promise<string> =>
        message.sourceLanguage !== this.userService.userState().defaultLanguage
          ? this.cacheCheckTranslation(message)
          : Promise.resolve(message.textInput)
      );

      const translatedTexts: any = await Promise.all(translationPromises);

      // ASSIGN TRANSLATED TEXTS BACK TO MESSAGES
      // Assign translated texts back to messages
      messages.forEach((message: ChatMessage, index: number) => message.textInput = translatedTexts[index]);

      this.messagesContainer = messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  public scrollToBottom(): void {
    const element: HTMLInputElement = this.chatContainer.nativeElement;
    element.scrollIntoView({ block: 'end' });
  }

  public onDeselectConversation(): void {
    this.conversationService.conversationSelected.set(null)
    this.router.navigate(['/home/conversations']);
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
  private playClickSound(): void {
    // this.audio.load();
    // this.audio.play();
    return;
  }
}
