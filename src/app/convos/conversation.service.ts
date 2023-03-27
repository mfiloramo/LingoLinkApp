import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public apiUrl: string = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient
  ) { }

  // DEBUG: CREATE CONVERSATION WHEN APP INITIALIZES
  public createConversation(body: object): any {
    return this.http.post(`${this.apiUrl}/conversations`, body);
  }

  public loadConversationsByUserId(userId: number) {
    return this.http.get(`${this.apiUrl}/conversations/${userId}`);
  }

  public loadConversationsByConvoId(convoId: number) {
    return this.http.get(`${this.apiUrl}/conversations/${convoId}`);
  }
}
