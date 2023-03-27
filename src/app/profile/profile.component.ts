import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() user: any;

  // DEBUG: CONSOLE LOG EACH NAV BUTTON'S INNER TEXT
  test(event: any) {
    // console.log(event.target.innerText);
    // console.log(this.user.user_id); // EXAMPLE IMPLEMENTATION
  }
}
