import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicClientApplication } from "@azure/msal-browser";
import { msalBrowserConfig } from "../../config/msalBrowserConfig";

const msalInstance: PublicClientApplication = new PublicClientApplication(msalBrowserConfig);

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
    msalInstance.loginPopup({ scopes: ["openid", "profile", "email"] })
      .then((response) => {
        this.authService.loginWithToken(response.accessToken).subscribe(
          () => this.router.navigate(['/home']),
          (error: any) => this.snackBar.open(error.message, 'Dismiss', { duration: 5000 })
        );
      })
      .catch((error: any) => {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      });
  }

  /** PRIVATE METHODS */
  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
