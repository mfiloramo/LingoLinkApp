import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from "../../components/language-selector/language-selector.component";

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [ CommonModule, LanguageSelectorComponent ],
  templateUrl: './language.view.html',
  styleUrl: './language.view.css'
})
export class LanguageView {

}
