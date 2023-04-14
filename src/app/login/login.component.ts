import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// ADD MSAL AND MSAL CONFIG
// import * as msal from "@azure/msal-browser";
// const msalConfig: msal.Configuration = {...};
// const msalInstance: msal.PublicClientApplication = new msal.PublicClientApplication(msalConfig);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.buildForm();
  }

  /** PUBLIC METHODS */
  public onLoginFormSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // USE MSAL TO ACQUIRE TOKEN AND LOG IN USER
      // msalInstance.loginPopup().then(() => {
      //   const account = msalInstance.getAllAccounts()[0];
      //   msalInstance.acquireTokenSilent({ scopes: ["User.Read"] }).then((accessTokenResponse) => {
      //     this.authService.loginWithToken(accessTokenResponse.accessToken).subscribe(
      //       () => this.router.navigate(['/home']),
      //       (error) => console.error(error)
      //     );
      //   }).catch((error) => {
      //     msalInstance.acquireTokenPopup({ scopes: ["User.Read"] }).then((accessTokenResponse) => {
      //       this.authService.loginWithToken(accessTokenResponse.accessToken).subscribe(
      //         () => this.router.navigate(['/home']),
      //         (error) => console.error(error)
      //       );
      //     }).catch((error) => console.error(error));
      //   });
      // });

      // TEMPORARY LOGIN WITH TEST USER ACCOUNT
      if (email === 'test@user.com' && password === 'password') {
        localStorage.setItem('token', 'testToken');
        this.router.navigate(['/home']);
      } else {
        this.snackBar.open(
          'Incorrect email or password.',
          'Close',
          { duration: 3000 }
        );
      }

    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  /** PRIVATE METHODS */
  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
