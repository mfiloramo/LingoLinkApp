import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "../../../environments/environment";
import { User } from "../../../interfaces/User.interfaces";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000';
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

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
    let params: HttpParams = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.get<any>(`${ this.apiUrl }/auth`, { params })
      .pipe(tap((response: any): void => {
          // VALIDATE USER AGAINST DATABASE AND LOG IN IF VALID RESPONSE
          if (response.IsValid && response.UserID) {
            this.loggedIn.next(true);
            const user: Partial<User> = { user_id: response.UserID };
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate([ '/home' ])
              .then((response: any) => response);
          } else {
            // DENY USER ACCESS IF INVALID RESPONSE
            this.snackBar.open('Invalid user credentials. Please try again.', 'Dismiss', { duration: 5000 });
          }
        }),
        catchError((error: any) => {
          this.snackBar.open('An error occurred', 'Dismiss', { duration: 5000 });
          return throwError(error);
        })
      );
  }

  public logout(): void {
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login'])
      .then((response: any) => response);
  }

  public async register(user: User): Promise<any> {
    // REGISTER USER IN DATABASE
    try {
      return this.http.post<any>(`${ this.apiUrl }/users`, user)
        .pipe(
          tap((response: any): void => {
            if (response) {
              // SEND EMAIL NOTIFICATIONS TO ADMIN / USER
              this.sendAdminRegNotification(user.email);
              this.snackBar.open('Thanks for registering! Your account is currently pending approval.', 'Dismiss', { duration: 5000 });
            } else {
              this.snackBar.open('Error registering account', 'Dismiss', { duration: 5000 });
            }
          }),
          catchError((error: any) => {
            this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
            return throwError(error);
          })
        ).toPromise();
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      throw error;
    }
  }

  /** PRIVATE METHODS */
  private async sendAdminRegNotification(userEmail: any): Promise<any> {
    // SEND EMAIL REGISTRATION NOTIFICATIONS TO ADMIN
    try {
      const params: any = new HttpParams().set('userEmail', userEmail);
      return this.http.get(`${ this.apiUrl }/auth/notify`, { params })
        .subscribe((response: any): void => {
          this.snackBar.open(response[0]);
        })
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      return throwError(error);
    }
  }
}
