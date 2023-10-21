import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { msalInstance } from "../../../config/msalBrowserConfig";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl: string = environment.apiBaseUrl || 'http://localhost:3000';
  public activeAccount: any;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /** PUBLIC METHODS */
  public async login(email: string, password: string): Promise<any> {
    try {
      // CONSTRUCT QUERY PARAMETERS
      let params: HttpParams = new HttpParams();
      params = params.append('email', email);
      params = params.append('password', password);

      // SEND GET REQUEST WITH QUERY PARAMETERS
      this.http.get<any>(`${ this.apiUrl }/users`, { params })
        .subscribe((response: any): void => {
          if (response.IsValid === 1) {
            // NAVIGATE TO HOME PAGE IF USER CREDENTIALS ARE VALID
            this.loggedIn.next(true);
            this.router.navigate(['/home']);
          } else {
            //
            this.snackBar.open('Invalid user credentials. Please try again.', 'Dismiss', { duration: 5000 });
          }
        });
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      throw error;
    }
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
    this.router.navigate(['/login'])
      .then((response: any) => response);
  }
}
