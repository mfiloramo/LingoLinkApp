import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent, ConfirmModalComponent ],
  templateUrl: './change-email.view.html',
})
export class ChangeEmailView {
  public isModalOpen: boolean = false;
  public temporaryEmail!: string;
  public changeEmailDataTargets: ChangeData[] = [
    { 'type': 'email' , 'target': this.userService.userState().email }
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public handleEmailChange(newEmail: string): void {
    if (newEmail && newEmail !== this.userService.userState().email) {
      this.temporaryEmail = newEmail;
      this.isModalOpen = true;
    }
  }

  public confirmChangeEmail(confirm: boolean): void {
    if (confirm) {
      this.changeEmail(this.temporaryEmail);
      this.isModalOpen = false;
      this.snackBar.open(`Confirmation email sent to ${ this.temporaryEmail }`, 'Dismiss', { duration: 5000 })
    } else {
      this.snackBar.open('Email change canceled', 'Dismiss', { duration: 5000 })
      this.isModalOpen = false;
    }
  }

  /** PRIVATE METHODS */
  private changeEmail(newEmail: string): void {
    console.log(newEmail);
  }
}
