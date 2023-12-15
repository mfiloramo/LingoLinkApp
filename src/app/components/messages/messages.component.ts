import { AfterViewChecked, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChatMessage } from "../../../interfaces/Message.interfaces";
import { Language } from '../../../interfaces/Language.interfaces';
import { TranslationService } from '../../services/translation/translation.service';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { MessageService } from '../../services/message/message.service';
import languageArray from '../../../utils/languageMapper';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../../interfaces/User.interfaces';
import { UserService } from "../../services/user/user.service";


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css', '../conversations/conversations.component.css'],
})
export class MessagesComponent implements OnInit, OnChanges, AfterViewChecked {
  // COMPONENT CHILDREN
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  // COMPONENT STATE
  public userState!: User;
  public messagesContainer: ChatMessage[] = [];
  public languageArray: Language[] = languageArray;
  public sourceLanguage!: Language;
  public textInput: string = '';
  public audio: any = new Audio();
  public isLoading: boolean = false;
  public conversationId!: number;
  public conversationStarter!: string;
  public conversationStarterPic!: string;


  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private userService: UserService,
  ) {
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    // @ts-ignore
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.userState = this.userService.userState();
    this.connectWebSocket();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('conversationId' in changes) {
      this.loadMessagesByConvId();
    }
  }

  /** PUBLIC METHODS */
  public onSendMessage(): void {
    if (!this.textInput.trim() || !this.sourceLanguage) return;

    this.playClickSound();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: ChatMessage = this.messageService.buildMessage({
      userId: this.userState.userId,
      textInput: this.textInput,
      conversationId: this.conversationId,
      sourceLanguage: this.sourceLanguage,
    });

    if (this.conversationId) {
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
  }

  public loadMessagesByConvId(): any {
    // CHECK IF CONVERSATION ID EXISTS
    if (this.conversationId) {
      this.isLoading = true;

      // GET LOCAL LANGUAGE CODE
      const localLangCode: string = this.translationService.getLanguageCode({ code: this.sourceLanguage.code });

      // FETCH MESSAGES FOR THE GIVEN CONVERSATION ID
      this.messageService.loadMessages(this.conversationId)
        .subscribe(async (response: any): Promise<void> => {
          // LOOP THROUGH MESSAGES AND TRANSLATE IF NECESSARY
          const translationPromises = response.map(async (message: any): Promise<void> => {
            if (message.sourceLanguage !== localLangCode && message.textInput) {
              // TRANSLATE/STRINGIFY MESSAGE CONTENT
              message.textInput = await this.cacheCheckTranslation(message, localLangCode);
            }
          });

          // TODO: THIS MIGHT HAVE TO DO WITH THE NEW CONVERSATION MESSAGE NOT APPEARING ONINIT
          // HANDLE TRANSLATED MESSAGES
          await Promise.all(translationPromises);
          this.messagesContainer = response;
          this.scrollToBottom();
          this.isLoading = false;
        }, (error: any): void => {
          this.isLoading = false;
          console.error('Failed to load messages for conversation:', error);
        });
    }
  }

  // TODO: IMPLEMENT USING USER SERVICE
  public onLangSelect(lang: any): void {
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === lang.target.value);
    if (selectedLanguage) {
      this.sourceLanguage = { code: selectedLanguage.code};
    }
  }

  public scrollToBottom(): void {
    const element: HTMLInputElement = this.chatContainer.nativeElement;
    element.scrollIntoView({ block: 'end' });
  }

  public onDeselectConversation(): void {
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
          const sourceLanguage: string = this.translationService.getLanguageCode(message.sourceLanguage);
          const targetLanguage: string = this.translationService.getLanguageCode(this.sourceLanguage);

          // TRANSLATE MESSAGE IF NEEDED
          if (sourceLanguage !== targetLanguage) {
            message.textInput = await this.translationService.getLiveTranslation({
              user: this.userState.userId,
              textInput: message.textInput,
              sourceLanguage: sourceLanguage,
              targLang: targetLanguage
            }).toPromise();
          }

            // PUSH MESSAGE TO SELECTED CONVERSATION
            if (message.conversationId === this.conversationId) {
              this.messagesContainer.push(message);
            }
        };

        reader.readAsText(event.data);
      });
  }

  private async cacheCheckTranslation(message: ChatMessage, localLangCode: string): Promise<any> {
    try {
      const translateKey: string = `${ message.messageId }_${ localLangCode }`;
      let storedTranslation: string | null = this.translationService.getStoredTranslation(translateKey);

      if (!storedTranslation) {
        storedTranslation = await this.translationService.getLiveTranslation({
          user: this.userState.userId,
          textInput: message.textInput,
          sourceLanguage: message.sourceLanguage,
          targLang: localLangCode
        }).toPromise();
        this.translationService.storeTranslation(translateKey, storedTranslation!);
      }

      if (storedTranslation !== null) {
        message.textInput = storedTranslation;
      }
      return message.textInput;
    } catch (error: any) {
      console.log(error);
    }
  }

  /** UTILITY FUNCTIONS */
  private playClickSound(): void {
    // this.audio.load();
    // this.audio.play();
    return;
  }
}
