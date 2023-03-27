import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: object = {};

  constructor(
    private http: HttpClient
  ) { }

  public setUser(): any {
    return this.http.get('http://localhost:3000/api/users');
  }
}
