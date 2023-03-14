import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // DEBUG: CONSOLE LOG EACH NAV BUTTON'S INNER TEXT
  test(event: any) {
    console.log(event.target.innerText);
  }
}
