import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import languageArray from '../utils/languageMapper';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public apiUrl: string = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {
  }

  // PERFORM LIVE TRANSLATION
  public getLiveTranslation(endpoint: string, payload: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${endpoint}`, payload)
      .pipe(map((response: object) => response))
  }

  // GET LANGUAGE CODE FROM NAME
  public getCodeFromName(name: string): string {
    return languageArray.find((language: any) => language.name === name)?.code || 'en';
  }

  // GET LANGUAGE CODE FROM LANGUAGE OBJECT
  public getLanguageCode(language: any): string {
    return typeof language === 'object' ? language.code : language;
  }

  // GET STORED TRANSLATION FROM LOCALSTORAGE
  public getStoredTranslation(translationKey: string): string | null {
    return localStorage.getItem(translationKey);
  }

  // STORE TRANSLATION IN LOCALSTORAGE
  public storeTranslation(translationKey: string, translatedText: string): void {
    localStorage.setItem(translationKey, translatedText);
  }

  public decodeHtmlEntities(encodedText: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedText;
    return textarea.value;
  }
}
