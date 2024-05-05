import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent, ConfirmModalComponent ],
  templateUrl: './change-username.view.html'
})
export class ChangeUsernameView {
  public isModalOpen: boolean = false;
  public temporaryUsername!: any;
  public changeUsernameDataTargets: ChangeData[] = [
    { 'type': 'username', 'target': this.userService.userState().username }
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public changeUsername(newUsername: any): void {
    try {
      // UPDATE USER RECORD IN DATABASE
      this.userService.updateUsername(newUsername[0].target);
    } catch (error) {
      // LOG ERROR TO CONSOLE
      console.error('Error:', error);
    } finally {
      // UPDATE LOCAL USER STATE
      this.userService.updateUserState({ username: newUsername[0].target });
    }
  }

  public handleChangeUsername(newUsername: any): void {
    // DISPLAY MODAL IF USERNAME IS EDITED
    if (newUsername[0].target && newUsername[0].target !== this.userService.userState().username) {
      this.temporaryUsername = newUsername;
      this.isModalOpen = true;
    }
  }

  public confirmChangeUsername(confirm: boolean): void {
    if (confirm) {
      this.changeUsername(this.temporaryUsername);
      this.isModalOpen = false;
      this.snackBar.open(`Username successfully changed to ${ this.temporaryUsername[0].target }`, 'Dismiss', { duration: 5000 })
    } else {
      this.snackBar.open('Username change canceled', 'Dismiss', { duration: 5000 })
      this.isModalOpen = false;
    }
  }
}
