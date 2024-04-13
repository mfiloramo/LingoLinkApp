import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from "../../../components/language-selector/language-selector.component";
import { TitleComponent } from "../../../components/title/title.component";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [ CommonModule, LanguageSelectorComponent, MatIconModule, RouterLink, TitleComponent ],
  templateUrl: './language.view.html',
  styleUrls: ['./language.view.css' ]
})
export class LanguageView {

}
