import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public apiUrl: string = 'http://localhost:3000/api'

  constructor(
    private http: HttpClient
  ) { }

  public storeTranslation(messageText: string): void {
    // STORE THE TRANSLATION IN LOCAL STORAGE BY msgId_localLangCode
  }

  public getStoredTranslation(messageId: number): string {
    // FETCH THE MESSAGE TEXT FROM LOCAL STORAGE BASED ON msgId_localLangCode
    return '';
  }

  public getLiveTranslation(path: string, body: any): any {
    // ALSO INVOKE STORETRANSLATION TO STORE
    return this.http.post(`${this.apiUrl}/${path}`, body);
  }
}
