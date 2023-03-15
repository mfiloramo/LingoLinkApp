import { EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeComponent } from "../app/home/home.component";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;
  @Output() updateChatbox = new EventEmitter<void>();
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
        this.updateChatbox.emit();
      }
    })
  }
}
