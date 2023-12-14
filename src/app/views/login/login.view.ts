import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private snackBar: MatSnackBar
  ) {}

  /** LIFECYCLE HOOKS */
  ngOnInit(): void {
    this.buildLoginForm();
  }

  /** PUBLIC METHODS */
  public onLoginFormSubmit(email: string, password: string): void {
    try {
      this.authService.login(email, password)
        .subscribe((response: any): void => {
          this.userService.updateUserState(response);
        });
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
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
