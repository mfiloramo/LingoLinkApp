import { Component } from '@angular/core';
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css']
})
export class ConvosComponent {
  // CONVERSATION DATA WILL LIKELY BE KEPT IN USER'S LOCALSTORAGE
  public mockData = [
    {
      avatar: 'A',
      name: 'Test Testerson',
      text: 'Hey person. This is a test message.'
    },
    {
      avatar: 'B',
      name: 'Joe Testerson',
      text: 'Hey dude. This is a test message.'
    },
    {
      avatar: 'C',
      name: 'Amanda Testerson',
      text: 'Hey amigo. This is a test message.'
    },
    {
      avatar: 'D',
      name: 'Sally Testerson',
      text: 'Hey amore mio. This is a test message.'
    },
    {
      avatar: 'E',
      name: 'Bobby Testerson',
      text: 'Hey lijepa. This is a test message.'
    },
  ]

  constructor(
    private translate: TranslationService
  ) {
  }
}
