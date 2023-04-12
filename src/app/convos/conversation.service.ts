import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public apiUrl: string = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient
  ) { }

  public createConversation(body: object): Observable<object> {
    return this.http.post(`${this.apiUrl}/conversations`, body);
  }

  public loadConversationsByUserId(userId: number): Observable<object> {
    return this.http.get(`${this.apiUrl}/conversations/${userId}`);
  }

  public loadConversationsByConvoId(conversationId: number): Observable<object> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}`);
  }

  // DELETES LOCALLY CACHED MESSAGES ONLY
  public deleteConversationByConvoId(conversationId: number): Observable<object> {
    return this.http.delete(`${this.apiUrl}/conversations/${conversationId}`);
  }
}
