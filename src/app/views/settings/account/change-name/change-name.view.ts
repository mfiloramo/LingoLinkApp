import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";
import { ConfirmModalComponent } from "../../../../components/confirm-modal/confirm-modal.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent, ConfirmModalComponent ],
  templateUrl: './change-name.view.html',
})
export class ChangeNameView {
  public isModalOpen: boolean = false;
  public temporaryFirstName!: string;
  public temporaryLastName!: string | undefined;
  public changeNameDataTargets: ChangeData[] = [
    { 'type': 'First Name' , 'target': this.userService.userState().firstName },
    { 'type': 'Last Name' , 'target': this.userService.userState().lastName },
  ];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  /** PUBLIC METHODS */
  public changeName(newFirstName: string, newLastName: any): void {
    // UPDATE USER RECORD IN DATABASE
    this.userService.updateName(newFirstName, newLastName);

    // UPDATE LOCAL USER STATE
    this.userService.updateUserState({ firstName: newFirstName, lastName: newLastName });
  }

  public handleChangeName(newFirstName: string, newLastName?: string | undefined): void {
    console.log('newFirstName', newFirstName, 'newLastName', newLastName);
    // DISPLAY MODAL IF EITHER FIRST AND/OR LAST NAMES ARE EDITED
    if ((newFirstName && newFirstName !== this.userService.userState().firstName) || (newLastName && newLastName !== this.userService.userState().lastName)) {
      this.temporaryFirstName = newFirstName;
      this.temporaryLastName = newLastName;
      this.isModalOpen = true;
    }
  }

  public confirmChangeName(confirm: boolean): void {
    if (confirm) {
      this.changeName(this.temporaryFirstName, this.temporaryLastName);
      this.isModalOpen = false;
      this.snackBar.open(`Name successfully changed to ${ this.temporaryFirstName } ${ this.temporaryLastName }`, 'Dismiss', { duration: 5000 })
    } else {
      this.snackBar.open('Name change canceled', 'Dismiss', { duration: 5000 })
      this.isModalOpen = false;
    }
  }
}
