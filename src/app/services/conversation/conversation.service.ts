import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Conversation } from "../../../interfaces/Conversation.interfaces";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  public conversationSelected: WritableSignal<any> = signal(null);
  public isNewConversation: WritableSignal<boolean> = signal(false);
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /** PUBLIC METHODS */
  public createConversation(conversation: any): Observable<any> {
    return this.http.post(`${ this.apiUrl }/conversations`, conversation)
      .pipe(catchError(this.handleError));
  }

  public loadConversationsByUserId(userId: number): Observable<Conversation[]> {
    const params: HttpParams = new HttpParams().set('id', userId);
    return this.http.get<Conversation[]>(`${ this.apiUrl }/conversations`, { params })
      .pipe(catchError(this.handleError));
  }

  public deleteConversation(userId: number, conversation: Conversation): any {
    try {
      return this.http.delete(`${ this.apiUrl }/participants`, {
        body: { userId, conversationId: conversation.conversationId }})
    } catch (error: any) {
      console.log('Error occurred', error);
    }
  }

  /** PRIVATE METHODS */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
