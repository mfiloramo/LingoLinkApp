import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /** PUBLIC METHODS */
  public canActivate(): boolean {

    // DISABLE IN DEV FOR ROUTE DEBUGGING
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']).then((response: any) => response);
      return false;
    }

    // ENABLE IN DEV FOR ROUTE DEBUGGING
    // return true;
  }
}
