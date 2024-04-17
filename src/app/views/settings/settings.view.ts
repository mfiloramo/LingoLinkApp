import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { LanguageSelectorComponent } from "../../components/language-selector/language-selector.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { TitleComponent } from "../../components/title/title.component";
import { routerAnimationFade } from "../../../utils/routerAnimations";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ CommonModule, MatIconModule, FormsModule, LanguageSelectorComponent, RouterLink, RouterOutlet, TitleComponent ],
  templateUrl: './settings.view.html',
  animations: routerAnimationFade,

})
export class SettingsView {
  // PUBLIC METHODS
  public prepareRoute(outlet: any): any {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
