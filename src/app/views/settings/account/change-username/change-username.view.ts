import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './change-username.view.html',
})
export class ChangeUsernameView {
  public currentUsername!: string;

  constructor(public userService: UserService) {
    this.currentUsername = this.userService.userState().username;
  }
}
