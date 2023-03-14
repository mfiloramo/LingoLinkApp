import { Component, ViewChild } from '@angular/core';
import { TranslationService } from "../../services/translation.service";
import mockData from "./mockData";

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
  @ViewChild('inputElement') inputElement: any;
  public mockConvo = mockData;


  constructor(
    private translate: TranslationService
  ) {}



  // DEBUG: CAPTURE INPUT TEXT FROM HTML ELEMENT inputElement
  public sendToServer() {
    const inputText: string = this.inputElement.nativeElement.value;

    // SEND API REQUEST WITH INPUT TEXT FROM UI
    this.translate.post('translate', { inputText })
      .subscribe(res => console.log(res));
  }
}
