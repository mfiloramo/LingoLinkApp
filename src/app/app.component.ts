import { Component } from '@angular/core';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public user: object = {};

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    // DEBUG: STUB USER DATA ON APP INITIALIZATION
    this.userService.setUser().subscribe((res: any) => {
      this.user = res;
    });
  }
}
