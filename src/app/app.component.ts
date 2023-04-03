import {Component, Output} from '@angular/core';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {

    // this.userService.setUser().subscribe((res: any) => {
    //   this.user = res;
    // });
  }
}
