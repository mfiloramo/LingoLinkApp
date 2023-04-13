import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  login(username: string, password: string): Observable<LoginResponse> {
    // THIS WILL CONNECT TO MY AUTH SOFTWARE
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

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkToken(): void {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
    }
  }
}
