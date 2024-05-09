import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent, ConfirmModalComponent ],
  templateUrl: './change-password.view.html'
})
export class ChangePasswordView {
  public isModalOpen: boolean = false;
  public temporaryPassword: any = {
    'currentPassword': '',
    'newPassword': '',
    'confirmNewPassword': ''
  };
  public changePasswordDataTargets: ChangeData[] = [
    { 'type': 'currentPassword', 'target': '' },
    { 'type': 'newPassword', 'target': '' },
    { 'type': 'confirmNewPassword', 'target': '' },
  ]
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public handlePasswordInput(data: any): void {
    try {
      if (data.type) {
        this.temporaryPassword[data.type] = data.value;
        // // CHECK IF ALL FIELDS ARE FILLED
        if (this.temporaryPassword.currentPassword && this.temporaryPassword.newPassword && this.temporaryPassword.confirmNewPassword) {
          if (this.temporaryPassword.newPassword === this.temporaryPassword.confirmNewPassword) {
            this.isModalOpen = true;
          } else {
            this.isModalOpen = false;
            this.snackBar.open('New passwords do not match', 'Dismiss', { duration: 5000 });
          }
        }
      }
    } catch (error: any) {
      console.error('Error in password input:', error);
    }
  }

  public confirmChangePassword(confirm: boolean): void {
    if (confirm) {
      // VALIDATE USER EMAIL/PASSWORD AGAINST DATABASE
      this.authService.validateUser(this.userService.userState().email, this.temporaryPassword.currentPassword)
        .subscribe((response: any): void => {
          if (response.username) {
            // CHANGE PASSWORD IF VALID RESPONSE RECEIVED
            this.changePassword(this.temporaryPassword.newPassword);
            this.snackBar.open(`Password successfully changed`, 'Dismiss', { duration: 5000 });
            return;
          } else {
            // DISPLAY ERROR IF INVALID RESPONSE RECEIVED
            this.snackBar.open(`Current password is incorrect.`, 'Dismiss', { duration: 5000 });
            return;
          }
        });
    } else {
      this.snackBar.open('Password change canceled', 'Dismiss', { duration: 5000 });
    }
    this.isModalOpen = false;
  }

  public changePassword(newPassword: any): void {
    console.log('changePassword pinged!');
    // UPDATE USER RECORD IN DATABASE
    // ...
    // LEVERAGE AUTH SERVICE
    // ...
    // LOG ERROR TO CONSOLE
    // ...
  }

  protected readonly confirm = confirm;
}
