import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../login/auth.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    // BUILD REGISTRATION FORM
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /** PUBLIC METHODS */
  public onRegistrationFormSubmit(): void {
    // IF FORM IS INVALID, RETURN
    if (this.registrationForm.invalid) {
      return;
    }

    // OTHERWISE, REGISTER USER AND REDIRECT TO HOME PAGE
    this.authService.register(this.registrationForm.value).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      (error: any) => {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      }
    );
  }
}
