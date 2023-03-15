import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Output } from '@angular/core';
import { TranslationService } from "../../services/translation.service";
import { WebSocketService } from "../../services/web-socket.service";

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
  public message: string = '';
  public userId: string = '';

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
    this.userId = Math.random().toString(36).substring(2, 7);
  }

  ngAfterViewInit() {
    this.scrollDown();
  }

  public scrollDown(): void {
    setTimeout(() => {
      this.renderer.setProperty(this.chatContainer.nativeElement, 'scrollTop', this.chatContainer.nativeElement.scrollHeight);
    }, 500);
  }

  public clearInputs(): void {
    this.inputElement.nativeElement.value = '';
  }

  public async onSendMessage(): Promise<any> {
    const sendMessage: object = {
      user: this.userId,
      text: this.inputElement.nativeElement.value,
      timestamp: new Date()
    }

    this.chatBox.mockConvo.push(sendMessage)

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(sendMessage);
    this.clearInputs();
    this.scrollDown();
  }
}
