import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationPayload } from '../../../interfaces/message.interfaces';
import { Language } from '../../../interfaces/language.interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /** PUBLIC METHODS */
  public getLiveTranslation(payload: TranslationPayload): Observable<any> {
    return this.http
      .post(`${ this.apiUrl }/translate`, payload)
      .pipe(map((response: object) => response))
  }

  public getLanguageCode(language: Language): string {
    return typeof language === 'object' ? language.code : language;
  }

  public getStoredTranslation(translationKey: string): string | null {
    return localStorage.getItem(translationKey);
  }

  public storeTranslation(translationKey: string, translatedText: string): void {
    localStorage.setItem(translationKey, translatedText);
  }
}
