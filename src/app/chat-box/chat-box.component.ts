import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslationService } from '../../services/translation.service';
import { WebSocketService } from './web-socket.service';
import { ConversationService } from '../convos/conversation.service';
import { MessageService } from './message.service';
import { Observable } from "rxjs";
import languageArray from '../../utils/languageMapper';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  animations: [
    trigger('fadeInInput', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('600ms ease-in')),
    ]),
    trigger('fadeInMessage', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
    ]),
  ],
})
export class ChatBoxComponent implements OnChanges, AfterViewChecked {
  @Input() user!: any;
  @Input() conversationId!: number;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  public srcLang: any = {code: 'en'};
  public languageArray: { name: string, code: string }[] = languageArray;
  public mainConvoContainer: any[] = [];
  public textInput: string = '';
  public audio: any = new Audio();
  public isLoading: boolean = false;

  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.initializeInputs();
    this.connectWebSocket()
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('conversationId' in changes) {
      this.loadConversationByConvoId().then((response: any) => response);
    }
  }

  /** PUBLIC METHODS */
  public async onSendMessage(): Promise<void> {
    // PREVENT SENDING EMPTY MESSAGE
    if (!this.textInput.trim()) return;

    // PLAY CLICK SOUND ON OUTGOING MESSAGE
    this.playClickSound();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message = this.buildMessage();

    // ADD MESSAGE TO CHATBOX
    this.mainConvoContainer.push(message);

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(message);

    // CREATE NEW CONVERSATION IF ONE IS NOT ALREADY SELECTED
    if (!this.conversationId) {
      // CREATE RANDOM CONVERSATION NAME
      const convoName: string = `conversation ${String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 10)}`;

      try {
        const response: any = await this.conversationService.createConversation({ 'name': convoName }).toPromise();
        // ASSIGN CONVERSATION ID (TABLE IDENTITY) RESPONSE
        this.conversationId = response.Conversation_id;

        // SEND MESSAGE TO DATABASE USING THE NEWLY CREATED CONVERSATION ID
        await this.messageService.sendMessage({
          conversationId: this.conversationId,
          userId: this.user.user_id,
          content: this.textInput,
          srcLang: this.translationService.getLanguageCode(this.srcLang),
        }).toPromise();
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // SEND MESSAGE TO DATABASE USING THE EXISTING CONVERSATION ID
      try {
        await this.messageService.sendMessage({
          conversationId: this.conversationId,
          userId: this.user.user_id,
          content: this.textInput,
          srcLang: this.translationService.getLanguageCode(this.srcLang),
        }).toPromise();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }

    // RESET TEXT INPUT
    this.textInput = '';
  }

  public async loadConversationByConvoId(): Promise<any> {
    // CHECK IF CONVERSATION ID EXISTS
    if (this.conversationId) {
      // SET LOADING FLAG TO TRUE
      this.isLoading = true;

      try {
        // FETCH MESSAGES FOR THE GIVEN CONVERSATION ID
        const selectedConvo: any = await this.messageService.loadMessages(this.conversationId).toPromise();
        // GET LOCAL LANGUAGE CODE
        const localLangCode: string = this.translationService.getLanguageCode(this.srcLang);

        // LOOP THROUGH MESSAGES AND TRANSLATE IF NECESSARY
        for (let message of selectedConvo) {
          if (message.source_language !== localLangCode && message.content) {
            // TRANSLATE MESSAGE CONTENT
            message.content = await this.handleTranslation(message, localLangCode);
          }
        }

        // ASSIGN FETCHED MESSAGES TO MAIN CONVO CONTAINER
        this.mainConvoContainer = selectedConvo;

        // SCROLL TO BOTTOM OF CONVERSATION
        this.scrollToBottom();
      } catch (error) {
        console.error('Failed to load messages for conversation:', error);
      } finally {
        // SET LOADING FLAG TO FALSE
        this.isLoading = false;
      }
    }
  }

  public onLangSelect(lang: any): void {
    const selectedLangCode = this.translationService.getCodeFromName(lang.target.value);
    if (typeof this.srcLang === 'object') {
      this.srcLang.code = selectedLangCode;
    } else {
      this.srcLang = { code: selectedLangCode, name: 'test' };
    }
  }

  public scrollToTop(): void {
    const element = this.chatContainer.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
  }

  public scrollToBottom(): void {
    const element = this.chatContainer.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  /** PRIVATE METHODS */
  private initializeInputs(): void {
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  private connectWebSocket(): void {
    // CONNECT TO WEBSOCKET VIA NG SERVICE
    this.webSocketService.connect();

    // LISTEN FOR INCOMING MESSAGES OVER WEBSOCKET CONNECTION
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
        // PARSE INCOMING MESSAGE
        const reader = new FileReader();
        reader.onload = async () => {
          const message = JSON.parse(reader.result as string);
          const msgSrc = this.translationService.getLanguageCode(message.srcLang);
          const targLng = this.translationService.getLanguageCode(this.srcLang);

          // TRANSLATE MESSAGE IF ITS SOURCE LANGUAGE IS DIFFERENT FROM LOCAL
          message.content = (msgSrc === targLng)
            ? message.content
            : await this.translateText(message.content, msgSrc, targLng);

          // ADD MESSAGE TO CONVERSATION CONTAINER IN THE DOM
          this.mainConvoContainer.push(message);
        };
        // READ THE EVENT DATA AS TEXT AND TRIGGER 'LOAD' EVENT FOR READER
        reader.readAsText(event.data);
      });
  }

  private buildMessage(): object {
    return {
      user: this.user.user_id,
      user_id: this.user.user_id,
      content: this.textInput,
      convoId: this.conversationId,
      srcLang: this.translationService.getLanguageCode(this.srcLang),
      timestamp: new Date().toISOString()
    };
  }

  private async handleTranslation(message: any, localLangCode: string): Promise<any> {
    // DEFINE TRANSLATION KEY BASED ON MESSAGE ID + SOURCE LANGUAGE
    const translateKey = `${message.message_id}_${localLangCode}`;

    // CHECK IF TRANSLATED MESSAGE IS IN LOCALSTORAGE
    const storedTranslation = this.translationService.getStoredTranslation(translateKey);
    if (!storedTranslation) {
      // TRANSLATE MESSAGE
      const translatedText = await this.translateText(message.content, message.source_language, localLangCode);
      const decodedText = this.translationService.decodeHtmlEntities(translatedText);

      // STORE TRANSLATED MESSAGE IN LOCALSTORAGE
      this.translationService.storeTranslation(translateKey, decodedText);

      // UPDATE MESSAGE CONTENT WITH TRANSLATED AND DECODED TEXT
      message.content = decodedText;
    } else {
      // UPDATE MESSAGE CONTENT WITH TRANSLATED AND DECODED TEXT FROM LOCALSTORAGE
      message.content = storedTranslation;
    }

    return message.content;
  }

  private playClickSound(): void {
    this.audio.load();
    this.audio.play();
  }

  /** UTILITY FUNCTIONS */
  private async translateText(content: string, srcLang: string, targLang: string): Promise<string> {
    // TRANSLATE RECEIVED TEXT IF DIFFERENT LANGUAGE THAN LOCAL
    const translatedContent = await this.translationService.getLiveTranslation('translate', {
      user: this.user.user_id, content, srcLang, targLang
    })
      .toPromise();

    // DECODE HTML ENTITIES
    return this.decodeHtmlEntities(translatedContent);
  }

  private decodeHtmlEntities(encodedText: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedText;
    return textarea.value;
  }
}
