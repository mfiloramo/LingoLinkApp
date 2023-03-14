import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { TranslationService } from "../../services/translation.service";
import mockData from "./mockData";

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
  @Output() sendMessage = new EventEmitter<string>();
  public mockConvo = mockData;
  public message: string = '';

  constructor(
    private translate: TranslationService,
  ) {}

  public onSend(): void {
    this.sendMessage.emit(this.message);
    this.message = '';
  }
}
