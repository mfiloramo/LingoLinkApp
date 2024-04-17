import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { routerAnimationFade } from "../../../../utils/routerAnimations";

@Component({
  selector: 'app-main-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, RouterLink, RouterOutlet ],
  templateUrl: './main-settings.view.html',
  animations: routerAnimationFade,

})
export class MainSettingsView {
  public appVersion: string = environment.appVersion;
}
