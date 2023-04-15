import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { msalInstance } from "../../config/msalBrowserConfig";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public async login(): Promise<void> {
    try {
      const response = await msalInstance.loginPopup({ scopes: ['openid', 'profile', 'email'] });
      if (response) {
        // STORE THE ACCESS TOKEN IN LOCALSTORAGE
        localStorage.setItem('token', response.accessToken);

        // SET THE loggedIn BehaviorSubject TO TRUE
        this.loggedIn.next(true);

        // NAVIGATE TO THE HOME PAGE
        await this.router.navigate(['/home']);
      }
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      throw error;
    }
  }

  public register(user: any): Observable<any> {
    return from(msalInstance.acquireTokenSilent({ scopes: ["api://<your-api-client-id>/access_as_user"] }))
      .pipe(
        switchMap((response: any) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.accessToken}`
            })
          };
          return this.http.post<any>('/register', user, httpOptions)
        .pipe(
            tap(res => {
              if (res.success) {
                localStorage.setItem('token', res.token);
                this.loggedIn.next(true);
                this.router.navigate(['/home']);
              } else {
                this.snackBar.open(res.message, 'Dismiss', { duration: 5000 });
              }
            }),
            catchError((error: any) => {
              this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
              return (error);
            })
          );
      }),
      catchError((error: any) => {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        return (error);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    msalInstance.logout();
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
