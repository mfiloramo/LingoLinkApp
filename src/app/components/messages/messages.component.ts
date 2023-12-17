import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { catchError, switchMap } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { TranslationService } from '../../services/translation/translation.service';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { UserService } from "../../services/user/user.service";
import { MessageService } from '../../services/message/message.service';
import { ChatMessage } from "../../../interfaces/Message.interfaces";
import { Language } from '../../../interfaces/Language.interfaces';
import { User } from '../../../interfaces/User.interfaces';
import languageArray from '../../../utils/languageMapper';
import { ConversationService } from "../../services/conversation/conversation.service";
import { Conversation } from "../../../interfaces/Conversation.interfaces";


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css', '../conversations/conversations.component.css'],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  // COMPONENT CHILDREN
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  // COMPONENT STATE
  public userState!: User;
  public messagesContainer: ChatMessage[] = [];
  public languageArray: Language[] = languageArray;
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
    // @ts-ignore
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.userState = this.userService.userState();
    this.conversationSelected = this.conversationService.conversationSelected();
    this.conversationStarterName = this.conversationSelected.StarterUsername;
    this.conversationStarterPic = this.conversationSelected.StarterUserPic;
    this.connectWebSocket();
    if (!this.conversationService.isNewConversation()) {
      this.loadMessagesByConvId(this.conversationSelected)
    }
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /** PUBLIC METHODS */
  public onSendMessage(): void {
    let messageLanguage = this.userService.userState().sourceLanguage;

    // TODO: ENSURE A MORE CONSISTENT AND UNIFIED APPROACH TO LANGUAGE NAMES/CODES
    if (messageLanguage.charAt(0) === messageLanguage.charAt(0).toUpperCase()) {
      const foundLanguage = this.languageArray.find(language => language.name === messageLanguage);
      messageLanguage = foundLanguage ? foundLanguage.code : messageLanguage;
    }


    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: ChatMessage = this.messageService.buildMessage({
      userId: this.userState.userId,
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

  public async loadMessagesByConvId(conversation: Conversation): Promise<void> {
    if (!this.conversationSelected) {
      return;
    }

    this.isLoading = true;

    try {
      const response: any = await this.messageService.loadMessages(conversation.conversationId).toPromise();
      const messages: ChatMessage[] = response;

      // Translate all messages asynchronously and wait for all to complete
      const translationPromises = messages.map(message =>
        message.sourceLanguage !== this.userService.userState().sourceLanguage
          ? this.cacheCheckTranslation(message)
          : Promise.resolve(message.textInput)
      );

      const translatedTexts: any = await Promise.all(translationPromises);

      // Assign translated texts back to messages
      messages.forEach((message, index) => message.textInput = translatedTexts[index]);

      this.messagesContainer = messages;
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  // TODO: MOVE TO USER SERVICE
  public onLanguageSelect(selectedLanguageEvent: any): void {
    const selectedLanguageName = selectedLanguageEvent.target.value;
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === selectedLanguageName);

    if (selectedLanguage) {
      this.userService.updateUserState({ sourceLanguage: selectedLanguage.code });
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
          const targetLanguage: string = this.userService.userState().sourceLanguage;

          // TRANSLATE MESSAGE IF NEEDED
          if (sourceLanguage !== targetLanguage) {
            message.textInput = await this.translationService.getLiveTranslation({
              user: this.userState.userId,
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
      const translateKey: string = `${ message.messageId }_${ this.userService.userState().sourceLanguage }`;
      let storedTranslation: string | null = this.translationService.getStoredTranslation(translateKey);

      if (!storedTranslation) {
        storedTranslation = await firstValueFrom(this.translationService.getLiveTranslation({
          user: this.userState.userId,
          textInput: message.textInput,
          sourceLanguage: message.sourceLanguage,
          targetLanguage: this.userService.userState().sourceLanguage
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
