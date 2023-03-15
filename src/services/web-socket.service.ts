import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocket: any;

  constructor() { }

  public connect(): void {
    this.webSocket = new WebSocket('ws://localhost:8080');
  }

  public send(message: any): void {
    this.webSocket.send(JSON.stringify(message));
  }

  public onMessage() {
    return new Observable(observer => {
      this.webSocket.onmessage = (event: any) => {
        observer.next(event);
      }
    })
  }
}
