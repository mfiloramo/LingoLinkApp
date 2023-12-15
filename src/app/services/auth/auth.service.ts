import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { User } from "../../../interfaces/User.interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: WritableSignal<boolean> = signal(false);
  private apiUrl: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /** PUBLIC METHODS */
  public isAuthenticated(): boolean {
    return this.loggedIn();
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.get<any>(`${ this.apiUrl }/auth`, { params: { email, password } })
      .pipe(
        tap((response: User) => this.handleLoginResponse(response)),
        catchError((error: any): any => this.handleError(error)),
      );
  }

  public logout(): void {
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

  public register(user: User): Observable<any> {
    // STUB: GENERATE RANDOM PROFILE IMAGE AS STRING
    user.profileImg = `https://randomuser.me/api/portraits/${ Math.random() < 0.5 ? 'men' : 'women' }/${ Math.floor(Math.random() * 50) + 1 }.jpg`;

    return this.http.post<any>(`${this.apiUrl}/users`, user)
      .pipe(
        tap((response: any) => this.handleRegisterResponse(response, user)),
        catchError((error: any) => this.handleError(error))
      );
  }

  /** PRIVATE METHODS */
  private handleLoginResponse(response: any): void {
    if (response.enabled && response.userId) {
      this.loggedIn.set(true);
    } else {
      this.displaySnackBar('Invalid user credentials. Please try again.');
      console.error('Login failed:', response);
    }
  }

  private handleRegisterResponse(response: any, user: User): void {
    if (response) {
      this.sendAdminRegNotification(user.email).subscribe();
      this.displaySnackBar('Thanks for registering! Your account is currently pending approval.');
    } else {
      this.displaySnackBar('Error registering account');
    }
  }

  private sendAdminRegNotification(userEmail: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/notify`, { params: { userEmail } });
  }

  private handleError(error: any): Observable<never> {
    this.displaySnackBar('An error occurred');
    return throwError(error);
  }

  private displaySnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 5000 });
  }
}
