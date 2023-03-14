import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslationService } from "../../services/translation.service";

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
    private translate: TranslationService
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
    const inputText: string = this.inputElement.nativeElement.value;
    // await this.translate.post('translate', { inputText })
    //   .subscribe(res => {
        this.chatBox.mockConvo.push({
          user: 'eclethro1',
          text: inputText,
          timestamp: new Date()
        })
        this.clearInputs();
        this.scrollDown();
      // });
    setTimeout(() => {
      this.scrollDown();
    }, 500);
  }

  public async simulateMessage(): Promise<any> {
    this.chatBox.mockConvo.push({
      user: 'reclethro1',
      text: 'This message should be intercepted.',
      timestamp: new Date()
    });
    setTimeout(() => {
      this.scrollDown();
    }, 500);
  }
}
