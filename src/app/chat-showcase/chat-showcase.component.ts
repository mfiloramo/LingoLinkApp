import { Component, ViewChild } from '@angular/core';
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-showcase.component.html',
  styleUrls: ['./chat-showcase.component.css']
})
export class ChatShowcaseComponent {
  @ViewChild('inputElement') inputElement: any;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private translate: TranslationService
  ) {
  }

  sendToServer() {
    // DEBUG: CAPTURE INPUT TEXT FROM HTML ELEMENT inputElement
    const inputText: string = this.inputElement.nativeElement.value;

    // SEND API REQUEST WITH INPUT TEXT FROM UI
    this.translate.post('translate', { inputText })
      .subscribe(res => console.log(res));
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = {
        sender: 'You',
        text: this.newMessage,
        timestamp: new Date()
      };
      this.messages.push(message);
      this.newMessage = '';
    }
  }
}
