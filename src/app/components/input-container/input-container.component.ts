import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { stringFormatterSnakeToNameCase, stringFormatterCamelToNameCase } from "../../../utils/stringFormatter";

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
  @Output() outputEmitter: EventEmitter<any> = new EventEmitter<any>();
  public passwordForm = new FormGroup({
    'currentPassword': new FormControl('', [ Validators.required ]),
    'newPassword': new FormControl('', [ Validators.required ]),
    'confirmPassword': new FormControl('', [ Validators.required ])
  });

  // COMPONENT STATE
  public password: string = '';
  protected readonly stringFormatter = stringFormatterSnakeToNameCase;

  constructor(
    public userService: UserService,
    public router: Router
  ) {}

  /** PUBLIC METHODS */
  public emitDataTargets(): void {
    this.dataTarget.emit(this.dataTargets);
  }

  public emitPassword(dataTarget: any): void {
    this.outputEmitter.emit({
      type: dataTarget.type,
      value: dataTarget.target
    });
  }

  public emitPasswordConfirm(output: any): void {
    this.passwordChange.emit(this.password);
    this.outputEmitter.emit(output);
  }

  /** PROTECTED METHODS */
  protected emitValidPasswordData(): void {
    // ENSURE ALL FIELDS ARE PROVIDED AND CONFIRM-PASSWORDS MATCH
    if (this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
      this.outputEmitter.emit(this.passwordForm.value);
    }
  }

  protected readonly stringFormatterCamelToNameCase = stringFormatterCamelToNameCase;
}
