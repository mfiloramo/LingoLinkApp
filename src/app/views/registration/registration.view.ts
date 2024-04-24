import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../services/auth/auth.service";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.view.html',
  styleUrls: ['../login/login.view.css']
})
export class RegistrationView implements OnInit {
  public registrationForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    this.buildRegistrationForm();
  }

  /** PUBLIC METHODS */
  public onRegistrationFormSubmit(): void {
    const user = this.registrationForm.value;
    this.authService.register(user).subscribe({
      next: (): void => {
        this.router.navigate([ '/login' ]);
      },
      error: (error: any): void => {
        this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
      }
    });
  }

  /** PRIVATE METHODS */
  private buildRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      firstName: [ '', [ Validators.required ] ],
      lastName: [ '', [ Validators.required ] ],
      username: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ],
      confirmPassword: [ '', [ Validators.required ] ]
    }, { validator: this.passwordMatchValidator });
  }


  private passwordMatchValidator(form: FormGroup): any {
    return form.controls['password'].value === form.controls['confirmPassword'].value ? null : { 'mismatch': true };
  }
}
