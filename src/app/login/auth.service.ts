import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse } from "../../interfaces/loginInterfaces";
import { msalInstance } from "../../config/msalBrowserConfig";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiClientId = environment.azureClientID;

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

  public loginWithToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/token-login', { token })
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
    return from(msalInstance.acquireTokenSilent({ scopes: ["api://<your-api-client-id>/access_as_user"] })).pipe(
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
