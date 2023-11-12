import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../services/auth/auth.service";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css', '../login/login.component.css']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.buildRegistrationForm();
  }

  /** PUBLIC METHODS */
  public buildRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      username: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      firstName: [ '', [ Validators.required ] ],
      lastName: [ '', [ Validators.required ] ],
      email: [ '', [ Validators.required, Validators.email ] ]
    })
  }

  public onRegistrationFormSubmit(): void {
    const user = this.registrationForm.value;
    this.authService.register(user)
      .then(() => this.router.navigate([ '/home' ]),
        (error: any): void => {
          this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        })
  }
}
