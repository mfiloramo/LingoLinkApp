import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { TranslationService } from "../../services/translation.service";
import { WebSocketService } from '../../services/web-socket.service';
import languageArray from "../../utils/languageMapper";

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent {
  @Input() user: any;
  @Input() srcLang: any = 'en';
  @Input() scrollDown: any;
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;
  public mockConvo: any = [];
  public message: string = '';

  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.srcLang = languageArray.find((item: any) => item.code === 'en');
    this.webSocketService.connect();
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
          const reader = new FileReader();
          reader.onload = async () => {
            let message = JSON.parse(reader.result as string);
            let srcLang = typeof this.srcLang === 'object' ? this.srcLang.code : this.srcLang;
            message.text = await this.translateText(message.text, message.srcLang, srcLang);
            this.mockConvo.push(message);
          };
          reader.readAsText(event.data);
      });

    // TODO: LOAD THE CONVERSATION FROM LOCAL STORAGE IF IT EXISTS
    // const savedConversation = localStorage.getItem('conversation');
    // if (savedConversation) {
    //   this.mockConvo = JSON.parse(savedConversation);
    // }
  }

  public async translateText(inputText: string, srcLang: string, targLang: string): Promise<any> {
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
}
