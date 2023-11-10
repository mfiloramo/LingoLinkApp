import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
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


  // POSSIBLY NOT NEEDED DUE TO auth.guard
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

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

    return this.http.get<any>(`${ this.apiUrl }/users`, { params })
      .pipe(tap((response: any): void => {
        // LOG USER IN IF VALID RESPONSE AND
        if (response.IsValid && response.UserID) {
          this.loggedIn.next(true);
          const user: User = { user_id: response.UserID };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate([ '/home' ]);
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

  public async register(user: any): Promise<any> {
    try {
      return this.http.post<any>('/register', user)
        .pipe(
          tap(res => {
            if (res.success) {
              this.loggedIn.next(true);
              this.router.navigate(['/home']);
            } else {
              this.snackBar.open(res.message, 'Dismiss', { duration: 5000 });
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

  public logout(): void {
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login'])
      .then((response: any) => response);
  }
}
