import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../login/auth.service";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from '../../config/msalBrowserConfig';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig);

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {}

  public onRegistrationFormSubmit(): void {
    const user = this.registrationForm.value;
    msalInstance.loginPopup({ scopes: ["openid", "profile", "email"], prompt: "select_account" })
      .then((response: any) => {
        this.authService.register(user).subscribe(
          () => this.router.navigate(['/home']),
          (error: any) => {
            this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
          }
        );
      })
      .catch((error: any) => {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      });
  }
}
