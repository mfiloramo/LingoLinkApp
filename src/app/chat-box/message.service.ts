import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ChatMessage } from "../../interfaces/messageInterfaces";
import { environment } from '../../environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public apiUrl: string = environment.apiBaseUrl;
  public user: object = {};

  constructor(
    private http: HttpClient
  ) { }

  public loadMessages(id: number): Observable<object> {
    return this.http.get(`${this.apiUrl}/messages/${id}`);
  }
  public async sendMessage(message: ChatMessage): Promise<any> {
    return this.http.post(`${this.apiUrl}/messages`, message).toPromise();
  }
}
