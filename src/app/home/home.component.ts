import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslationService } from "../../services/translation.service";
import { WebSocketService } from "../../services/web-socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('inputElement') inputElement: any;
  @ViewChild('chatBox') chatBox: any;
  @ViewChild('chatContainer') chatContainer: any;
  @ViewChild('messageList') messageList: any;
  public message: string = '';

  constructor(
    private renderer: Renderer2,
    private translationService: TranslationService,
    private webSocketService: WebSocketService
  ) {}

  ngAfterViewInit() {
    this.scrollDown();
  }

  public scrollDown(): void {
    this.renderer.setProperty(this.chatContainer.nativeElement, 'scrollTop', this.chatContainer.nativeElement.scrollHeight);
  }

  public clearInputs(): void {
    this.inputElement.nativeElement.value = '';
  }

  public async onSendMessage(message: any): Promise<any> {
    const sendMessage: object = {
      user: 'eclethro1',
      text: this.inputElement.nativeElement.value,
      timestamp: new Date()
    }

    this.chatBox.mockConvo.push(sendMessage)

    // SEND MESSAGE TO SERVER USING WebSocketService
    this.webSocketService.send(sendMessage);
    this.clearInputs();
    setTimeout(() => {
      this.scrollDown();
    }, 500);
  }
}
