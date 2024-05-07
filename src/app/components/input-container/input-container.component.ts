import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from "../../services/user/user.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-input-container',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './input-container.component.html'
})
export class InputContainerComponent {
  // COMPONENT I/O
  @Input() dataTargets!: any;
  @Output() dataTarget: EventEmitter<string> = new EventEmitter<string>();
  @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();

  // COMPONENT STATE
  public password: string = '';


  constructor(public userService: UserService) {}

  /** PUBLIC METHODS */
  public emitDataTargets(): void {
    this.dataTarget.emit(this.dataTargets);
  }

  public emitValue(password: any): void {
    this.passwordChange.emit(password);
  }
}

