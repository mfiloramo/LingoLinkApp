import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { User } from "../../../interfaces/User.interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000';
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /** PUBLIC METHODS */
  public isAuthenticated(): boolean {
    return this.loggedIn.value && this.currentUserSubject.value !== null;
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.get<any>(`${ this.apiUrl }/auth`, { params: { email, password } })
      .pipe(
        tap((response: any) => this.handleLoginResponse(response)),
        catchError((error: any) => this.handleError(error))
      );
  }

  public logout(): void {
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  public register(user: User): Observable<any> {
    // STUB: GENERATE RANDOM PROFILE IMAGE AS STRING
    user.profile_img = `https://randomuser.me/api/portraits/${ Math.random() < 0.5 ? 'men' : 'women' }/${ Math.floor(Math.random() * 50) + 1 }.jpg`
    return this.http.post<any>(`${this.apiUrl}/users`, user)
      .pipe(
        tap((response: any) => this.handleRegisterResponse(response, user)),
        catchError((error: any) => this.handleError(error))
      );
  }

  /** PRIVATE METHODS */
  private handleLoginResponse(response: any): void {
    if (response.enabled && response.user_id) {
      this.loggedIn.next(true);
      this.currentUserSubject.next(response as User);
      localStorage.setItem('currentUser', JSON.stringify(response));
      this.router.navigate(['/chat']);
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
