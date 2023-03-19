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
  public srcLang: any = 'en';

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
    this.user = Math.random().toString(36).substring(2, 7);
    // POPULATE LANGUAGE DROPDOWN MENU
    for (let key of languageArray) {
      this.languageArray.push(key);
    }
  }

  ngAfterViewInit() {
    this.scrollDown();
  }

  public onLangSelect(lang: any) {
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
    const msgObj: object = {
      user: this.user,
      text: this.inputElement.nativeElement.value,
      srcLang: this.srcLang,
      timestamp: new Date()
    }

    this.chatBox.mockConvo.push(msgObj)

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(msgObj);
    this.clearInputs();
    this.scrollDown();
  }
}
