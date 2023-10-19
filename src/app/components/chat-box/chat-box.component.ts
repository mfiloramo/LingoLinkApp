import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  AfterViewChecked,
  SimpleChanges,
  ViewChild, OnInit
} from '@angular/core';
import { ChatMessage } from "../../../interfaces/message.interfaces";
import { Language } from '../../../interfaces/language.interfaces';
import { TranslationService } from '../../services/translation/translation.service';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { ConversationService } from '../../services/conversation/conversation.service';
import { MessageService } from '../../services/message/message.service';
import languageArray from '../../../utils/languageMapper';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() user!: any;
  @Input() conversationId!: number;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  public source_language: any = { code: 'en' };
  public languageArray: Language[] = languageArray;
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
    this.audio.src = '../../assets/sounds/clickSound.mp3';
    this.languageArray.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.connectWebSocket()
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('conversationId' in changes) {
      this.loadConversationByConvoId();
    }
  }

  /** PUBLIC METHODS */
  public async onSendMessage(): Promise<void> {
    // PREVENT SENDING EMPTY MESSAGE
    if (!this.textInput.trim()) return;

    // PLAY CLICK SOUND ON OUTGOING MESSAGE
    this.playClickSound();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const message: ChatMessage = this.buildMessage();

    // ADD MESSAGE TO CHATBOX
    this.mainConvoContainer.push(message);

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(message);

    // CREATE NEW CONVERSATION IF ONE IS NOT ALREADY SELECTED
    if (!this.conversationId) {
      // CREATE RANDOM CONVERSATION NAME
      const convoName: string = `Conversation ${ String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 10) }`;

      try {
        const response: any = await this.conversationService.createConversation({ 'name': convoName });
        // ASSIGN CONVERSATION ID (TABLE IDENTITY) RESPONSE
        this.conversationId = response.Conversation_id;

        // SEND MESSAGE TO DATABASE USING THE NEWLY CREATED CONVERSATION ID
        await this.messageService.sendMessage({
          conversation_id: this.conversationId,
          user_id: this.user.user_id,
          content: this.textInput,
          source_language: this.translationService.getLanguageCode(this.source_language),
        });
      } catch (error: any) {
        console.log(error);
      }
    } else {
      // SEND MESSAGE TO DATABASE USING THE EXISTING CONVERSATION ID
      try {
        await this.messageService.sendMessage({
          conversation_id: this.conversationId,
          user_id: this.user.user_id,
          content: this.textInput,
          source_language: this.translationService.getLanguageCode(this.source_language),
        });
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }

    // RESET TEXT INPUT
    this.textInput = '';
  }

  public loadConversationByConvoId(): any {
    /** THIS NEEDS COMPLETE REFACTORING */

    // CHECK IF CONVERSATION ID EXISTS
    if (this.conversationId) {
      this.isLoading = true;

      // GET LOCAL LANGUAGE CODE
      const localLangCode: string = this.translationService.getLanguageCode(this.source_language);

      // FETCH MESSAGES FOR THE GIVEN CONVERSATION ID
      this.messageService.loadMessages(this.conversationId)
        .subscribe(async (response: any): Promise<void> => {
          // LOOP THROUGH MESSAGES AND TRANSLATE IF NECESSARY
          // const translationPromises = response.map(async (message: any) => {
          //   if (message.source_language !== localLangCode && message.content) {
          //     TRANSLATE/STRINGIFY MESSAGE CONTENT
              // message.content = await this.handleTranslation(message, localLangCode);
            // }
          // });

          // WAIT FOR ALL TRANSLATION PROMISES TO RESOLVE
          // await Promise.all(translationPromises);

          // ASSIGN FETCHED MESSAGES TO MAIN CONVO CONTAINER
          this.mainConvoContainer = response;

          // SCROLL TO BOTTOM OF CONVERSATION
          this.scrollToBottom();

          // SET isLoading TO FALSE AFTER TRANSLATIONS ARE DONE
          this.isLoading = false;
        }, (error) => {
          console.error('Failed to load messages for conversation:', error);
          this.isLoading = false;
        });
    }
  }

  public onLangSelect(lang: any): void {
    const selectedLanguage: Language | undefined = this.languageArray.find((language: Language): boolean => language.name === lang.target.value);
    if (selectedLanguage) {
      this.source_language = { code: selectedLanguage.code };
    }
  }

  public scrollToTop(): void {
    const element = this.chatContainer.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
  }

  public scrollToBottom(): void {
    const element: HTMLInputElement = this.chatContainer.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
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

          // TRANSLATE MESSAGE IF ITS SOURCE LANGUAGE IS DIFFERENT FROM LOCAL
          //   message.content = (msgSrc === targLng)
          //     ? message.content
          //     : await this.translateText(message.content, msgSrc, targLng)
          //       .then((response: any) => response);

            // ADD MESSAGE TO CONVERSATION CONTAINER IN THE DOM IF USER HAS SELECTED CONVERSATION
            if (message.conversation_id === this.conversationId) {
              this.mainConvoContainer.push(message);
            }
        };
        // READ THE EVENT DATA AS TEXT AND TRIGGER 'LOAD' EVENT FOR READER
        reader.readAsText(event.data);
      });
  }

  private buildMessage(): ChatMessage {
    return {
      user_id: this.user.user_id,
      content: this.textInput,
      conversation_id: this.conversationId,
      source_language: this.translationService.getLanguageCode(this.source_language),
      timestamp: new Date().toISOString()
    };
  }

  private async handleTranslation(message: ChatMessage, localLangCode: string): Promise<any> {
    try {
      const translateKey: string = `${ message.message_id }_${ localLangCode }`;
      const storedTranslation: string | null = this.translationService.getStoredTranslation(translateKey);

      if (!storedTranslation) {
        const translatedText: string = await this.translateText(message.content, message.source_language, localLangCode);
        const decodedText: string = this.translationService.decodeHtmlEntities(translatedText);
        this.translationService.storeTranslation(translateKey, decodedText);
        message.content = decodedText;
      } else {
        message.content = storedTranslation;
      }
      return message.content;
    } catch (error: any) {
      console.log(error);
    }
  }

  /** UTILITY FUNCTIONS */
  private async translateText(content: string, source_language: string, targLang: string): Promise<string> {
    const response = await this.translationService.getLiveTranslation('translate', {
      user: this.user.user_id,
      content,
      source_language,
      targLang
    }).toPromise();
    return this.translationService.decodeHtmlEntities(response);
  }

  private playClickSound(): void {
    this.audio.load();
    this.audio.play();
  }
}
