import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  imports: [ CommonModule ],
  standalone: true,
  animations: [
    trigger('fadeBlur', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('500ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmModalComponent {
  // COMPONENT I/O
  @Input() inputType!: string;
  @Input() inputValues!: (string | undefined)[];
  @Output() confirmEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** PUBLIC METHODS */
  public emitConfirm(value: boolean): void {
    // EMIT CONFIRMATION EVENT
    this.confirmEvent.emit(value);
  }

  public emitCancel(value: boolean): void {
    // EMIT CANCELLATION EVENT
    this.cancelEvent.emit(value);
  }
}
