import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { UserService } from "../../../../services/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { AuthService } from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ CommonModule, ConfirmModalComponent, InputContainerComponent ],
  templateUrl: './delete-account.view.html',
})
export class DeleteAccountView {
  public isModalOpen: boolean = false;
  public temporaryPassword!: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  /** PUBLIC METHODS */
  public deleteUserAccount(userId: number, password: string): void {
    try {
      // DELETE USER FROM DATABASE
      // ...

      return
    } catch (error: any) {
      // HANDLE ERROR
      console.error('Error deleting user account:', error);
    } finally {
      // LOG USER OUT + NAVIGATE BACK TO HOMEPAGE
      this.authService.logout();
    }
  }
}
