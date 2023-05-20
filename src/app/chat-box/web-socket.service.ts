import { EventEmitter, Injectable, Output } from '@angular/core';
import {Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  @Output() updateChatbox = new EventEmitter<void>();
  private webSocket: any;

  constructor() { }

  public connect(): void {
    this.webSocket = new WebSocket('ws://localhost:8085');
  }

  public send(msgObj: object): void {
    this.webSocket.send(JSON.stringify(msgObj));
  }

  public onMessage(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.webSocket.onmessage = (event: any) => {
        observer.next(event);
      }
    })
  }
}
