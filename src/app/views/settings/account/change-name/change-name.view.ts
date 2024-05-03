import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../../services/user/user.service";
import { InputContainerComponent } from "../../../../components/input-container/input-container.component";
import { ChangeData } from "../../../../../interfaces/ChangeData.interfaces";

@Component({
  selector: 'app-change-name',
  standalone: true,
  imports: [ CommonModule, InputContainerComponent ],
  templateUrl: './change-name.view.html',
})
export class ChangeNameView {
  // TODO: IMPLEMENT INTERFACE FOR DATATARGET
  public changeNameDataTargets: ChangeData[] = [
    { 'type': 'First Name' , 'target': this.userService.userState().firstName },
    { 'type': 'Last Name' , 'target': this.userService.userState().lastName },
  ];

  constructor(public userService: UserService) {}
}
