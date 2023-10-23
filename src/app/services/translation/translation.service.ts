import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import languageArray from '../../../utils/languageMapper';
import { TranslationPayload } from '../../../interfaces/message.interfaces';
import { Language } from '../../../interfaces/language.interfaces';
import { environment } from '../../../environments/environment';

// TODO: IMPLEMENT PAYLOAD TYPECHECKING
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /** PUBLIC METHODS */
  public getLiveTranslation(endpoint: string, payload: {
    textInput: string;
    source_language: string;
    targLang: string;
    user: any
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${ endpoint }`, payload)
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

  // TODO: REMOVE DOM MANIPULATION FROM TRANSLATION SERVICE
  public decodeHtmlEntities(encodedText: string): string {
    const textarea: any = document.createElement('textarea');
    textarea.innerHTML = encodedText;
    return textarea.value;
  }
}
