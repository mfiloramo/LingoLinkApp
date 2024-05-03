import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './change-email.view.html',
})
export class ChangeEmailView {
  public currentEmail!: string;

  constructor(public userService: UserService) {
    this.currentEmail = this.userService.userState().email;
  }
}
