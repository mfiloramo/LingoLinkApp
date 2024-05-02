import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatMessage } from "../../../interfaces/Message.interfaces";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:8080';
  public user: object = {};

  constructor(private http: HttpClient) { }

  /** PUBLIC METHODS */
  public loadMessages(id: number): Observable<object> {
    return this.http.get(`${ this.apiUrl }/messages/${ id }`);
  }

  public buildMessage(message: ChatMessage): ChatMessage {
    return {
      userId: message.userId,
      textInput: message.textInput,
      conversationId: message.conversationId,
      sourceLanguage: message.sourceLanguage,
      timestamp: new Date().toISOString()
    };
  }

  public sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post(`${ this.apiUrl }/messages`, message);
  }
}
