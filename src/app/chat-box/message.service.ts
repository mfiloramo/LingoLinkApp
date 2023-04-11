import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public apiUrl: string = 'http://localhost:3000/api';
  public user: object = {};

  constructor(
    private http: HttpClient
  ) { }

  public loadMessages(id: any): any {
    return this.http.get(`${this.apiUrl}/messages/${id}`);
  }
// TODO: ADD INTERFACES FOR TYPECHECKING
  public sendMessage(message: object): any {
    return this.http.post(`${this.apiUrl}/messages`, message);
  }
}
