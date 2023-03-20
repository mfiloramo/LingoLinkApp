import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Output } from '@angular/core';
import { TranslationService } from "../../services/translation.service";
import { WebSocketService } from "../../services/web-socket.service";
import languageArray from "../../utils/languageMapper";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('inputElement') inputElement: any;
  @ViewChild('chatBox') chatBox: any;
  @ViewChild('chatContainer') chatContainer: any;
  @ViewChild('messageList') messageList: any;
  public languageArray: any[] = [];
  public message: string = '';
  public user: string = '';
  public srcLang: any = 'English';
  public audio: any = new Audio();

  constructor(
    private renderer: Renderer2,
    private translationService: TranslationService,
    private webSocketService: WebSocketService,
  ) {
    this.webSocketService.updateChatbox.subscribe(() => {
      this.scrollDown();
    })
  }

  ngOnInit(): void {
    // DEBUG: SET STUBBED UNIQUE USERID
    this.user = Math.random().toString(36).substring(2, 7);

    // SET CLICK SOUND SOURCE
    this.audio.src = '../../assets/sounds/clickSound.mp3';

    // POPULATE LANGUAGE DROPDOWN MENU
    languageArray.forEach((langObj: object) => this.languageArray.push(langObj))
    this.languageArray.sort((a, b) => a.name.localeCompare(b.name));

    // SET DEFAULT VALUES FOR LOCAL SOURCE LANGUAGE
    let setLang: any = languageArray.find((item: any) => item.code === 'en')
    this.srcLang = setLang.code;
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

  public scrollDown(): void {
    setTimeout(() => {
      this.renderer.setProperty(
        this.chatContainer.nativeElement,
        'scrollTop',
        this.chatContainer.nativeElement.scrollHeight
      );
    }, 500);
  }

  public clearInputs(): void {
    this.inputElement.nativeElement.value = '';
  }

  public async onSendMessage(): Promise<any> {
    // PLAY CLICK SOUND
    this.audio.play();

    // BUILD THE MESSAGE OBJECT FOR HTTP REQUEST
    const msgObj: object = {
      user: this.user,
      text: this.inputElement.nativeElement.value,
      srcLang: this.srcLang,
      timestamp: new Date()
    }

    // ADD MESSAGE TO CHATBOX
    this.chatBox.mockConvo.push(msgObj)

    // TODO: ADD msgObj TO LOCALSTORAGE
    // ...

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(msgObj);
    this.clearInputs();
    this.scrollDown();
  }
}
