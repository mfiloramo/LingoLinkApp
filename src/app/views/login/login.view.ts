import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from "../../services/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.css'],
})
export class LoginView implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /** LIFECYCLE HOOKS */
  public ngOnInit(): void {
    this.buildLoginForm();
  }

  /** PUBLIC METHODS */
  public onLoginFormSubmit(email: string, password: string): void {
    if (this.loginForm.valid) {
      this.authService.login(email, password).subscribe({
        next: (response: any): void => {
          this.userService.updateUserState(response);
          this.router.navigate(['/home']);
        },
        error: (error: any): void => {
          this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Please enter valid credentials', 'Dismiss', { duration: 5000 });
    }
  }

  /** PRIVATE METHODS */
  private buildLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
