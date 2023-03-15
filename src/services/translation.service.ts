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

  public post(path: string, body: object) {
    // TODO: SET PROPERTIES OF LANGUAGE TO BE TRANSLATED BY POINTING TO CLIENT CONFIGURED VALUES (LocalSt)
    return this.http.post(`${this.apiUrl}/${path}`, body);
  }
}
