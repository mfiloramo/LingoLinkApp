import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  AfterViewChecked,
  OnInit,
  SimpleChanges,
  Output, EventEmitter
} from '@angular/core';
import { ChatMessage } from "../../../interfaces/Message.interfaces";
import { Language } from '../../../interfaces/Language.interfaces';
import { TranslationService } from '../../services/translation/translation.service';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { ConversationService } from '../../services/conversation/conversation.service';
import { MessageService } from '../../services/message/message.service';
import languageArray from '../../../utils/languageMapper';
import { catchError, switchMap, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { User } from "../../../interfaces/User.interfaces";


@Component({
  selector: 'app-chatbox',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
})
export class MessageBoxComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() user!: User;
  @Input() conversationId: number = 1;
  @Output() conversationDeselected: EventEmitter<null> = new EventEmitter();
  @Output() newMessage: EventEmitter<string> = new EventEmitter<string>();
  @Output() newConversation: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  public source_language: any = { code: 'en' };
  public languageArray: Language[] = languageArray;
  public mainConvoContainer: ChatMessage[] = [];
  public textInput: string = '';
  public audio: any = new Audio();
  public isLoading: boolean = false;


  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private conversationService: ConversationService,
    private messageService: MessageService,
  ) {
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
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
    if (!this.textInput.trim()) return;
    this.playClickSound();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: ChatMessage = this.messageService.buildMessage({
      user_id: this.user.user_id,
      textInput: this.textInput,
      conversationId: this.conversationId,
      source_language: this.source_language,
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
          this.mainConvoContainer.push(message);
          this.textInput = '';
        } else {
          console.log('Error');
        }
      });
    } else {
      // CREATE NEW CONVERSATION WITH CONVERSATION/MESSAGE INPUT
      this.newConversation.emit();
      this.newMessage.emit(this.textInput);
      this.textInput = '';
    }
  }

  public loadMessagesByConvId(): any {
    // CHECK IF CONVERSATION ID EXISTS
    if (this.conversationId) {
      this.isLoading = true;

      // GET LOCAL LANGUAGE CODE
      const localLangCode: string = this.translationService.getLanguageCode(this.source_language);

      // FETCH MESSAGES FOR THE GIVEN CONVERSATION ID
      this.messageService.loadMessages(this.conversationId)
        .subscribe(async (response: any): Promise<void> => {
          // LOOP THROUGH MESSAGES AND TRANSLATE IF NECESSARY
          const translationPromises = response.map(async (message: any): Promise<void> => {
            if (message.source_language !== localLangCode && message.textInput) {
              // TRANSLATE/STRINGIFY MESSAGE CONTENT
              message.textInput = await this.cacheCheckTranslation(message, localLangCode);
            }
          });

          // HANDLE TRANSLATED MESSAGES
          await Promise.all(translationPromises);
          this.mainConvoContainer = response;
          this.scrollToBottom();
          this.isLoading = false;
        }, (error: any): void => {
          this.isLoading = false;
          console.error('Failed to load messages for conversation:', error);
        });
    }
  }

  public onLangSelect(lang: any): void {
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === lang.target.value);
    if (selectedLanguage) {
      this.source_language = { code: selectedLanguage.code };
    }
  }

  public scrollToBottom(): void {
    const element: HTMLInputElement = this.chatContainer.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  public onDeselectConversation(): void {
    this.conversationDeselected.emit(null);
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
          const msgSrc: string = this.translationService.getLanguageCode(message.source_language);
          const targLng: string = this.translationService.getLanguageCode(this.source_language);

          // TRANSLATE MESSAGE IF NEEDED
          if (msgSrc !== targLng) {
            await this.translateText(message.textInput, msgSrc, targLng)
              .then((response: any): void => message.textInput = response);
          }

            // ADD MESSAGE TO CONVERSATION CONTAINER IN THE DOM IF USER HAS SELECTED CONVERSATION
            if (message.conversationId === this.conversationId) this.mainConvoContainer.push(message);
        };

        reader.readAsText(event.data);
      });
  }

  private async cacheCheckTranslation(message: ChatMessage, localLangCode: string): Promise<any> {
    try {
      const translateKey: string = `${ message.message_id }_${ localLangCode }`;
      const storedTranslation: string | null = this.translationService.getStoredTranslation(translateKey);

      if (!storedTranslation) {
        // TODO: MAKE THIS A DIRECT CALL TO TRANSLATE.SERVICE
        const decodedText: string = await this.translateText(message.textInput, message.source_language, localLangCode);
        this.translationService.storeTranslation(translateKey, decodedText);
        message.textInput = decodedText;
      } else {
        message.textInput = storedTranslation;
      }
      return message.textInput;
    } catch (error: any) {
      console.log(error);
    }
  }

  /** UTILITY FUNCTIONS */
  private async translateText(textInput: string, source_language: string, targLang: string): Promise<string> {
    return await this.translationService.getLiveTranslation({
      user: this.user.user_id, textInput, source_language, targLang }).toPromise();
  }

  private playClickSound(): void {
    this.audio.load();
    this.audio.play();
    return;
  }
}
