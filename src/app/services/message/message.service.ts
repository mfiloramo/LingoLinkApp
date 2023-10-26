import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatMessage } from "../../../interfaces/message.interfaces";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000';
  public user: object = {};

  constructor(
    private http: HttpClient
  ) { }

  public loadMessages(id: number): Observable<object> {
    return this.http.get(`${ this.apiUrl }/messages/${ id }`);
  }

  public async sendMessage(message: ChatMessage): Promise<any> {
    return this.http.post(`${ this.apiUrl }/messages`, message).toPromise();
  }

  public buildMessage(message: ChatMessage): ChatMessage {
    return {
      userID: message.userID,
      textInput: message.textInput,
      conversationId: message.conversationId,
      source_language: message.source_language.code,
      timestamp: new Date().toISOString()
    };
  }
}
