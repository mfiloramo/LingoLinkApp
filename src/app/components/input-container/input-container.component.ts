import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { stringFormatter } from "../../../utils/stringFormatter";

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
  @Output() outputEmitter: EventEmitter<string> = new EventEmitter<string>();

  // COMPONENT STATE
  public password: string = '';


  constructor(
    public userService: UserService,
    public router: Router
  ) {
  }

  /** PUBLIC METHODS */
  public emitDataTargets(): void {
    this.dataTarget.emit(this.dataTargets);
  }

  public emitPassword(password: any): void {
    this.passwordChange.emit(password);
  }

  public emitPasswordConfirm(output: any): void {
    this.passwordChange.emit(this.password);
    this.outputEmitter.emit(output);
  }

  protected readonly stringFormatter = stringFormatter;
}
