import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../services/user/user.service";

@Component({
  selector: 'app-input-container',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './input-container.component.html'
})
export class InputContainerComponent {
  @Input() dataTargets!: any;

  constructor(public userService: UserService) {}

}

