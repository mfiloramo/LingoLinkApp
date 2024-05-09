import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  @Output() updateChatbox: EventEmitter<void> = new EventEmitter<void>();
  public webSocketUrl = environment.websocketHost || 'ws://localhost:8081'
  private readonly RECONNECT_INTERVAL: number = 5000;
  private webSocket: any;

  /** PUBLIC METHODS */
  public connect(): void {
    this.webSocket = new WebSocket(this.webSocketUrl);

    this.webSocket.onopen = (): void => {
      console.log('WebSocket is open now.');
    };

    this.webSocket.onerror = (error: any): void => {
      console.log(`WebSocket error observed: `, error);
    };

    this.webSocket.onclose = (): void => {
      console.log('WebSocket connection closed');
    };
  }

  public disconnect(): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.close();
    } else {
      console.error("Can't close the connection, as the WebSocket is not open.");
    }
  }

  public send(msgObj: object): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(msgObj));
    } else {
      console.error("Can't send message, the WebSocket connection isn't open");
    }
  }

  public onMessage(): Observable<any> {
    return new Observable((observer: Observer<any>): void => {
      this.webSocket.onmessage = (event: any): void => {
        observer.next(event);
      }
    })
  }
}
