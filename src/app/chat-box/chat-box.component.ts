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
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TranslationService} from '../../services/translation.service';
import {WebSocketService} from '../../services/web-socket.service';
import {ConversationService} from '../convos/conversation.service';
import {MessageService} from './message.service';
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
  @Input() conversationId!: any;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  public srcLang: any = 'en';
  public languageArray: { name: string, code: string }[] = languageArray;
  public mainConvoContainer: any[] = [];
  public textInput: string = '';
  public audio: any = new Audio();

  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    // SET INITIAL INPUTS
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
    this.srcLang = languageArray.find((item: any) => item.code === 'en');

    // CONNECT TO WEBSOCKET SERVER
    this.webSocketService.connect();

    // ADD WEBSOCKET MESSAGE EVENT LISTENER
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
        // PARSE INCOMING WEBSOCKET MESSAGE
        const reader = new FileReader();
        reader.onload = async () => {
          // SET VARIABLES FOR TRANSLATION
          const message = JSON.parse(reader.result as string);
          const msgSrc = typeof message.srcLang === 'object' ? message.srcLang.code : message.srcLang;
          const targLng = typeof this.srcLang === 'object' ? this.srcLang.code : this.srcLang;
          // CHECK/HANDLE IF INCOMING MESSAGE NEEDS TRANSLATION
          // TODO: SET UP LOGIC TO HANDLE WITH IF/ELSE BLOCK RATHER THAN TERNARY OPERATOR
          message.content = (msgSrc === targLng)
            ? message.content
            : 'translated text';
            // : await this.translateText(message.content, msgSrc, targLng);
          this.mainConvoContainer.push(message);
          // TODO: CALL TranslationService TO STORE TEXT IN LOCALSTORAGE WITH ID (if logic)
          // ...
        };
        reader.readAsText(event.data);
    });
  }

  ngAfterViewChecked(): void {
    const element = this.chatContainer.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('conversationId' in changes) {
      this.loadConversationByConvoId().then((response: any) => response);
    }
  }

  /** UTILITY FUNCTIONS */
  private getCodeFromName(name: string): string | undefined {
    const language = this.languageArray.find((lang: any) => lang.name === name);
    return language?.code;
  }

  private async translateText(content: string, srcLang: string, targLang: string): Promise<string> {
    // TRANSLATE RECEIVED TEXT IF DIFFERENT LANGUAGE THAN LOCAL
    if (srcLang !== targLang) {
      return await this.translationService.getLiveTranslation('translate', {
        user: this.user.user_id, content, srcLang, targLang
      })
        .toPromise();
    } else {
      return content;
    }
  }

  /** CLASS METHODS */
  public async onSendMessage(): Promise<void> {
    // PLAY CLICK SOUND
    this.audio.play();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: object = {
      user: this.user.user_id,
      user_id: this.user.user_id,
      content: this.textInput,
      convoId: this.conversationId,
      srcLang: typeof this.srcLang === 'object' ? this.srcLang.code : this.srcLang,
      timestamp: new Date().toISOString()
    };

    // ADD MESSAGE TO CHATBOX
    this.mainConvoContainer.push(message);

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(message);

    // SEND MESSAGE TO WC-CORE DATABASE
    try {
      await this.messageService.sendMessage({
        conversationId: this.conversationId,
        userId: this.user.user_id,
        content: this.textInput,
        srcLang: typeof this.srcLang === 'object' ? this.srcLang.code : this.srcLang,
      })
        .toPromise();
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    // CLEAR USER INPUT
    this.textInput = '';
  }

  public async loadConversationByConvoId(): Promise<any> {
    if (this.conversationId) {
      try {
        // RETRIEVE ALL MESSAGES FROM DB WITH SELECTED ConversationId
        const selectedConvo = await this.messageService.loadMessages(this.conversationId).toPromise();
        // ITERATE THROUGH ALL MESSAGES IN SELECTED CONVERSATION
        for (let message of selectedConvo) {
          if (message.source_language !== this.srcLang) {
            // HANDLE UNTRANSLATED MESSAGE NOT ALREADY CACHED IN LOCALSTORAGE
            if (!localStorage.getItem(`${message.message_id}_${this.srcLang.code}`)) {
              // TRANSLATE MESSAGE CONTENT TO LOCAL LANGUAGE
              message.content = await this.translateText(message.content, message.source_language, this.srcLang.code)
                .then((translation: string) => {
                  // CACHE TRANSLATED MESSAGE IN LOCALSTORAGE WITH UNIQUE ID AND RETURN TRANSLATION
                  localStorage.setItem(`${message.message_id}_${this.srcLang.code}`, translation);
                  return translation;
                })
            }
          }
        }
        // POPULATE MESSAGE CONTAINER WITH CONVERSATION AND SCROLL DOWN
        this.mainConvoContainer = selectedConvo;
        this.scrollToBottom();
      } catch (error) {
        console.error('Failed to load messages for conversation:', error);
      }
    }
  }

  public onLangSelect(lang: any): void {
    this.srcLang = this.getCodeFromName(lang.target.value);
  }

  public scrollToTop(): void {
    const element = this.chatContainer.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
  }

  public scrollToBottom(): void {
    setTimeout(() => {
      const element = this.chatContainer.nativeElement;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
  }
}
