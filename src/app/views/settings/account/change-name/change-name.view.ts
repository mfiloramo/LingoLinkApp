import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './change-name.view.html',
})
export class ChangeNameView {
  public currentFirstName!: string;
  public currentLastName!: string;

  constructor(public userService: UserService) {
    this.currentFirstName = this.userService.userState().firstName;
    this.currentLastName = this.userService.userState().lastName;
  }
}
