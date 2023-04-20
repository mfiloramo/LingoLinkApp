import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { msalInstance } from "../../config/msalBrowserConfig";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public activeAccount: any;

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
      this.activeAccount = await msalInstance.loginPopup({
        scopes: ['openid', 'profile', 'email', 'user.read', `api://${environment.azureAPIClientID}/LingoLinkCore`,
        ]
      });
      if (this.activeAccount) {
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

  public async register(user: any): Promise<any> {
    try {
      const response = await msalInstance.acquireTokenSilent({ scopes: [`api://${environment.azureAPIClientID}/access_as_user`] });
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
    msalInstance.logoutRedirect();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
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
          scopes: [`api://${environment.azureAPIClientID}/LingoLinkCore`],
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
