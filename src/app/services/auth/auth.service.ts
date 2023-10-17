import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      const response = await this.http.get<any>(`${ this.apiUrl }/users`, {
        params: {
          email: email,
          password: password
        }
      }).toPromise();


      if (response.IsValid) {
        // Navigate to home page
        this.loggedIn.next(true);
        await this.router.navigate(['/home']);
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }

    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      throw error;
    }
  }


  public async register(user: any): Promise<void> {
    try {
      const response = await msalInstance.acquireTokenSilent({ scopes: [`api://lingolink-api/general`] });
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
    msalInstance.logoutRedirect().then((response: any) => response);
    this.loggedIn.next(false);
    this.router.navigate(['/login']).then((response: any) => response);
  }

  public async getAccessToken(): Promise<string> {
    console.log('getAccessToken pinged...');
    let response: any;
    try {
      if (!this.activeAccount) {
        throw new Error('No active account found');
      }

      try {
        response = await msalInstance.acquireTokenSilent({
          scopes: [`api://lingolink-api/general`],
          account: this.activeAccount,
        })
      } catch (error: any) {
        console.log(error)
      }

      return response.accessToken ? response.accessToken : 'no access token found';
    } catch (error) {
      throw error;
    }
  }

  public checkToken(): void {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      this.activeAccount = accounts[0];

      // Add console log here
      console.log('Account after checkToken:', this.activeAccount);

      this.loggedIn.next(true);
    }
  }
}
