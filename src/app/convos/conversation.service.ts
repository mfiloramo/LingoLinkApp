import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public apiUrl: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  public async createConversation(body: object): Promise<any> {
    return this.http.post(`${this.apiUrl}/conversations`, body).toPromise();
  }

  public async loadConversationsByUserId(userId: number): Promise<any> {
    return this.http.get(`${this.apiUrl}/conversations/${userId}`).toPromise();
  }

  public async loadConversationsByConvoId(conversationId: number): Promise<any> {
    return this.http.get(`${this.apiUrl}/conversations/${conversationId}`).toPromise();
  }

  public async deleteConversationByConvoId(conversationId: number): Promise<any> {
    return this.http.delete(`${this.apiUrl}/conversations/${conversationId}`).toPromise();
  }

}
