import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "./auth.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  testUser = { email: 'test@user.com', password: 'password' };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: [this.testUser.email, [Validators.required, Validators.email]],
      password: [this.testUser.password, [Validators.required]]
    });
  }

  // public onLoginFormSubmit(): void {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;
  //     if (email === this.testUser.email && password === this.testUser.password) {
  //       this.authService.login(email, password)
  //         .subscribe(
  //           () => this.router.navigate(['/']),
  //           () => this.snackBar.open('Incorrect email or password.', 'Close', { duration: 3000 })
  //         );
  //     } else {
  //       this.snackBar.open('Incorrect email or password.', 'Close', { duration: 3000 });
  //     }
  //   } else {
  //     this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
  //   }
  // }

  public onLoginFormSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email === this.testUser.email && password === this.testUser.password) {
        this.router.navigate(['/home']);
      } else {
        this.snackBar.open('Incorrect email or password.', 'Close', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
    }
  }

}
