import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../../services/auth/auth.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup<any> = new FormGroup({
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

  /** PUBLIC METHODS */
  public onRegistrationFormSubmit(): void {
    const user = this.registrationForm.value;
    this.authService.register(user)
      .then(() => this.router.navigate([ '/home' ]),
        (error: any): void => {
          this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        })
  }
}
