import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationPayload } from '../../../interfaces/Message.interfaces';
import { environment } from '../../../environments/environment';
import languageArray from "../../../utils/languageMapper";
import { Language } from "../../../interfaces/Language.interfaces";

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000/api';
  public readonly languageArray: Language[] = languageArray;

  constructor(private http: HttpClient) {}

  /** PUBLIC METHODS */
  public getLiveTranslation(payload: TranslationPayload): Observable<any> {
    return this.http
      .post(`${ this.apiUrl }/translate`, payload)
      .pipe(map((response: object) => response))
  }

  public getStoredTranslation(translationKey: string): string | null {
    return localStorage.getItem(translationKey);
  }

  public storeTranslation(translationKey: string, translatedText: string): void {
    localStorage.setItem(translationKey, translatedText);
  }

  public getLanguageDetails(code: string): string | undefined {
    const selectedLang: Language | undefined = this.languageArray.find((language: Language): boolean => code === language.code);
    return selectedLang?.name;
  }
}
