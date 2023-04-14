import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse } from "../../interfaces/loginInterfaces";
import * as Msal from 'msal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private msalConfig: any = {
    auth: {
      clientId: 'your-client-id-here',
      authority: 'https://login.microsoftonline.com/your-tenant-id-here'
    }
  };
  private clientApplication: any = new Msal.UserAgentApplication(this.msalConfig);

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/', { username, password })
      .pipe(
        tap(res => {
          if (res.success) {
            localStorage.setItem('token', res.token);
            this.loggedIn.next(true);
            this.router.navigate(['/home']);
          } else {
            this.snackBar.open(res.message, 'Dismiss', { duration: 5000 });
          }
        })
      );
  }

  public register(user: any): Observable<any> {
    return this.http.post<any>('/register', user)
      .pipe(
        tap(res => {
          if (res.success) {
            localStorage.setItem('token', res.token);
            this.loggedIn.next(true);
            this.router.navigate(['/home']);
          } else {
            this.snackBar.open(res.message, 'Dismiss', { duration: 5000 });
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public checkToken(): void {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
    }
  }
}
