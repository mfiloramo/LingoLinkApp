import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocket: WebSocket;
  private readonly RECONNECT_INTERVAL: number = 5000;
  private readonly HEARTBEAT_INTERVAL: number = 30000;

  public messages: Subject<string> = new Subject<string>();

  constructor() {
    this.connect();
    this.heartbeat();
  }

  /** PUBLIC METHODS */
  public connect(): void {
    this.webSocket = new WebSocket(environment.websocketHost);

    this.webSocket.onopen = (): void => {
      console.log('WebSocket is open now.');
    };

    this.webSocket.onerror = (error: any): void => {
      console.log(`WebSocket error observed: `, error);
    };

    this.webSocket.onmessage = (event: MessageEvent): void => {
      this.messages.next(event.data);
    };

    this.webSocket.onclose = (event: CloseEvent): void => {
      console.log('WebSocket connection closed:', event);
      setTimeout(() => this.connect(), this.RECONNECT_INTERVAL);
    };
  }

  public sendMessage(message: string): void {
    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error('Cannot send message, WebSocket connection is not open.');
    }
  }

  /** PRIVATE METHODS */
  private heartbeat(): void {
    setInterval(() => {
      if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send('ping');
      }
    }, this.HEARTBEAT_INTERVAL);
  }
}
