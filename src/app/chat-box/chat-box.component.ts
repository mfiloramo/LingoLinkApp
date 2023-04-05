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
import { WebSocketService } from '../../services/web-socket.service';
import { ConversationService } from '../convos/conversation.service';
import { MessageService } from './message.service';
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
  public srcLang: any = {code: 'en'};
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
  ) {
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.startChat();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
    this.playClickSound();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message = this.buildMessage();

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
        srcLang: this.getLanguageCode(this.srcLang),
      })
        .toPromise();
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    this.textInput = '';
  }

  public async loadConversationByConvoId(): Promise<any> {
    if (this.conversationId) {
      try {
        const selectedConvo = await this.messageService.loadMessages(this.conversationId).toPromise();
        for (let message of selectedConvo) {
          const srcLangCode = this.getLanguageCode(this.srcLang);
          if (message.source_language !== srcLangCode) {
            message.content = await this.handleTranslation(message, srcLangCode);
          }
        }
        this.mainConvoContainer = selectedConvo;
        this.scrollToBottom();
      } catch (error) {
        console.error('Failed to load messages for conversation:', error);
      }
    }
  }

  public onLangSelect(lang: any): void {
    const selectedLangCode = this.getCodeFromName(lang.target.value);
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
  private startChat(): void {
    this.initializeInputs();
    this.connectWebSocket();
  }

  private initializeInputs(): void {
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  private connectWebSocket(): void {
    this.webSocketService.connect();
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const message = JSON.parse(reader.result as string);
          const msgSrc = this.getLanguageCode(message.srcLang);
          const targLng = this.getLanguageCode(this.srcLang);

          message.content = (msgSrc === targLng)
            ? message.content
            : 'translated text'
            // : await this.translateText(message.content, msgSrc, targLng)

          this.mainConvoContainer.push(message);
        };
        reader.readAsText(event.data);
      });
  }

  private playClickSound(): void {
    this.audio.play();
  }

  private buildMessage(): object {
    return {
      user: this.user.user_id,
      user_id: this.user.user_id,
      content: this.textInput,
      convoId: this.conversationId,
      srcLang: this.getLanguageCode(this.srcLang),
      timestamp: new Date().toISOString()
    };
  }

  private getLanguageCode(lang: any): string {
    return typeof lang === 'object' ? lang.code : lang;
  }

  private async handleTranslation(message: any, srcLangCode: string): Promise<string> {
    const translationKey = `${message.message_id}_${srcLangCode}`;
    if (!localStorage.getItem(translationKey)) {
      const translation = await this.translateText(message.content, message.source_language, srcLangCode);
      localStorage.setItem(translationKey, translation);
      return translation;
    } else {
      return localStorage.getItem(translationKey) as string;
    }
  }
}
