import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-change-Password',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent, ConfirmModalComponent ],
  templateUrl: './change-password.view.html'
})
export class ChangePasswordView {
  public isModalOpen: boolean = false;
  public temporaryPassword!: any;
  public changePasswordDataTargets: ChangeData[] = [
    { 'type': 'current-password', 'target': '' },
    { 'type': 'new-password', 'target': '' },
    { 'type': 'confirm-new-password', 'target': '' },
  ]
  private userId = this.userService.userState().userId;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public handleChangePassword(newPassword: any): void {
    // DISPLAY MODAL IF Password IS EDITED
    if (newPassword[0].target && newPassword[0].target !== this.userService.userState().Password) {
      this.temporaryPassword = newPassword;
      this.isModalOpen = true;
    }
  }

  public confirmChangePassword(confirm: boolean): void {
    if (confirm) {
      this.changePassword(this.temporaryPassword);
      this.isModalOpen = false;
      this.snackBar.open(`Password successfully changed to ${ this.temporaryPassword[0].target }`, 'Dismiss', { duration: 5000 })
    } else {
      this.snackBar.open('Password change canceled', 'Dismiss', { duration: 5000 })
      this.isModalOpen = false;
    }
  }

  public changePassword(newPassword: any): void {
    try {
      // UPDATE USER RECORD IN DATABASE
      this.authService.validateUser(this.userId, newPassword);
    } catch (error) {
      // LOG ERROR TO CONSOLE
      console.error('Error:', error);
    }
  }
}
