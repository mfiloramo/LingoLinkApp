import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent ],
  templateUrl: './change-username.view.html',
})
export class ChangeUsernameView {
  // TODO: IMPLEMENT INTERFACE FOR DATATARGET
  public changeUsernameDataTargets: ChangeData[] = [
    { 'type': 'username' , 'target': this.userService.userState().username }
  ];

  constructor(public userService: UserService) {}
}
