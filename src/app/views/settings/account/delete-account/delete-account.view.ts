import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { UserService } from "../../../../services/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { RouterLink } from "@angular/router";
import { NavigationService } from "../../../../services/navigation/navigation.service";
import { AuthService } from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ CommonModule, ConfirmModalComponent, InputContainerComponent, RouterLink ],
  templateUrl: './delete-account.view.html',
})
export class DeleteAccountView {
  @Input() password: string = '';
  public isFinalConfirmInputOpened: boolean = false;
  public deleteAccountDataTargets: ChangeData[] = [
    { 'type': 'delete-account', 'target': this.userService.userState().email }
  ];

  constructor(
    protected userService: UserService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public setPassword(password: string): void {
    this.password = password;
  }

  public confirmDeleteAccount(email: string, password: any): void {
    if (email && password) {
      try {
        this.authService.validateUser(email, password)
          .subscribe((response: any): void => {
            if (response.username) {
              this.userService.deleteUser(this.userService.userState().userId, password)
              this.authService.logoutUser();
              this.snackBar.open(`Your account has been successfully deleted`, 'Dismiss', { duration: 5000 })
              return response;
            }
          });
      } catch (error: any) {
        console.error('Error deleting user account:', error);
      }
    }
  }

  public requestDeleteAccount(confirm: boolean): void {
    if (confirm) {
      this.isFinalConfirmInputOpened = true;
      return;
    } else if (!confirm) {
      this.navigationService.navigateBack();
    } else {
      // DOUBLE-CONFIRM; TOGGLE MODAL
      this.snackBar.open(`Error deleting account`, 'Dismiss', { duration: 5000 })
    }
  }
}

