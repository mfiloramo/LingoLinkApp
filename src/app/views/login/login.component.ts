import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() user: any;
  public loginForm!: FormGroup;

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
  public onLoginFormSubmit(email: string, password: string): void {
    try {
      this.authService.login(email, password)
        .subscribe((response: any) => response);
    } catch (error: any) {
      this.snackBar.open(error.message, 'Dismiss', { duration: 5000 });
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
