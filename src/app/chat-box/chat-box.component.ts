import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {TranslationService} from "../../services/translation.service";
import {WebSocketService} from '../../services/web-socket.service';
import {ConversationService} from "../convos/conversation.service";
import {MessageService} from "./message.service";
import languageArray from "../../utils/languageMapper";

@Component({
  selector: 'app-chatbox',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnChanges {
  @Input() user: any;
  @Input() conversationId: any;
  @ViewChild('chatContainer') chatContainer: any;
  @ViewChild('inputElement') inputElement: any;
  public srcLang: any = 'English';
  public languageArray: any[] = [];
  public mockConvo: any = [];
  public message: string = '';
  public audio: any = new Audio();
  public convoId: any;

  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
    private conversationService: ConversationService,
    private messageService: MessageService,
  ) {
    this.webSocketService.updateChatbox.subscribe(() => {
      this.scrollDown();
    });
  }

  ngOnInit(): void {
    // DEBUG: SET STUBBED UNIQUE USERID...
    const randomNumbers = [2, 6, 8, 9, 10, 11, 12, 13, 14, 15];
    this.user = Math.random() < 0.5 ? 14 : randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
    console.log(`You are user: ${this.user}`);

    // SET CLICK SOUND SOURCE
    this.audio.src = '../../assets/sounds/clickSound.mp3';

    // POPULATE LANGUAGE DROPDOWN MENU
    languageArray.forEach((langObj: object) => this.languageArray.push(langObj))
    this.languageArray.sort((a, b) => a.name.localeCompare(b.name));

    // SET DEFAULT VALUES FOR LOCAL SOURCE LANGUAGE
    let setLang: any = languageArray.find((item: any) => item.code === 'en')
    this.srcLang = setLang.code;

    // SET DEFAULT LANGUAGE TO ENGLISH IN LANGUAGE SELECTION DROPDOWN
    this.srcLang = languageArray.find((item: any) => item.code === 'en');

    // START WEBSOCKET SERVICE AND LISTEN FOR NEW MESSAGES
    this.webSocketService.connect();
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
        const reader = new FileReader();
        reader.onload = async () => {
          let message = JSON.parse(reader.result as string);
          // TODO: SIMPLIFY INPUT LOGIC BELOW
          let msgSrc = typeof message.srcLang === 'object' ? message.srcLang.code : message.srcLang;
          let targLng = typeof this.srcLang === 'object' ? this.srcLang.code : this.srcLang;
          message.content = await this.translateText(message.text, msgSrc, targLng);
          this.mockConvo.push(message);
        };
        reader.readAsText(event.data);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('conversationId' in changes) {
      this.loadConversationByConvoId().then((response: any) => response)
    }
  }

  ngAfterViewInit() {
    this.scrollDown();
  }

  public onLangSelect(lang: any): void {
    this.srcLang = this.getCodeFromName(lang.target.value);
  }

  public getCodeFromName(name: string): string | undefined {
    const language = languageArray.find((lang) => lang.name === name);
    return language?.code;
  }

  public async onSendMessage(): Promise<any> {
    // PLAY CLICK SOUND
    this.audio.play();

    // BUILD MESSAGE OBJECT FOR HTTP REQUEST
    const msgObj: object = {
      user: this.user,
      user_id: this.user,
      text: this.inputElement.nativeElement.value,
      convoId: this.convoId,
      srcLang: this.srcLang,
      timestamp: new Date().toISOString()
    };

    // ADD MESSAGE TO CHATBOX
    this.mockConvo.push(msgObj);

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(msgObj);

    // SEND MESSAGE TO WC-CORE DATABASE
    this.messageService.sendMessage({
      conversationId: this.conversationId,
      userId: this.user,
      content: this.inputElement.nativeElement.value,
    })
      .subscribe((response: any) => response);

    // CLEAR INPUTS AND SCROLL CHATBOX DOWN
    this.message = '';
    this.scrollDown();
  }

  public async loadConversationByConvoId(): Promise<any> {
    if (this.conversationId) {
      try {
        await this.messageService.loadMessages(this.conversationId)
          .subscribe((response: any) => {
            this.mockConvo = response;
            this.scrollDown();
          });
      } catch (error) {
        console.error('Failed to load messages for conversation:', error);
      }
    }
  }

  public async translateText(inputText: string, srcLang: string, targLang: string): Promise<any> {
    // TRANSLATE RECEIVED TEXT IF DIFFERENT LANGUAGE THAN LOCAL
    if (srcLang !== targLang) {
      return await this.translationService
        .post('translate', {
          user: this.user,
          srcLang,
          inputText,
          targLang
        }).toPromise();
    } else {
      return inputText;
    }
  }

  public scrollDown(): void {
    // SCROLL MESSAGE BOX TO THE BOTTOM
    setTimeout(() => {
      const chatContainer = this.chatContainer.nativeElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 10);
  }
}
