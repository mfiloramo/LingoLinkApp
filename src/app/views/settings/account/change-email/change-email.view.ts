import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent ],
  templateUrl: './change-email.view.html',
})
export class ChangeEmailView {
  public changeEmailDataTargets: ChangeData[] = [
    { 'type': 'email' , 'target': this.userService.userState().email }
  ];

  constructor(public userService: UserService) {}
}
