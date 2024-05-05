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
  public temporaryUsername!: string;
  public changeUsernameDataTargets: ChangeData[] = [
    { 'type': 'username', 'target': this.userService.userState().username }
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public changeUsername(newUsername: string): void {
    console.log('newUsername', newUsername);
  }

  public handleUsernameChange(newUsername: string): void {
    if (newUsername && newUsername !== this.userService.userState().username) {
      this.temporaryUsername = newUsername;
      this.isModalOpen = true;
    }
  }

  public confirmChangeUsername(confirm: boolean): void {
    if (confirm) {
      this.changeUsername(this.temporaryUsername);
      this.isModalOpen = false;
      this.snackBar.open(`Username successfully changed to ${ this.temporaryUsername }`, 'Dismiss', { duration: 5000 })
    } else {
      this.snackBar.open('Username change canceled', 'Dismiss', { duration: 5000 })
      this.isModalOpen = false;
    }
  }
}
