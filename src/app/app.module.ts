// CORE MODULE IMPORTS
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// ANGULAR MATERIAL COMPONENTS
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { _MatCheckboxRequiredValidatorModule } from '@angular/material/checkbox';

// CUSTOM COMPONENTS
import { AppComponent } from './app.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { TitleComponent } from "./components/title/title.component";

// VIEWS
import { HomeView } from './views/home/home.view';
import { LoginView } from './views/login/login.view';
import { PageNotFoundView } from './views/page-not-found/page-not-found.view';
import { RegistrationView } from './views/registration/registration.view';
import { SettingsView } from "./views/settings/settings.view";


@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        NavbarComponent,
        HomeView,
        ConversationsComponent,
        PageNotFoundView,
        LoginView,
        RegistrationView
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    MatExpansionModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatRadioModule,
    _MatCheckboxRequiredValidatorModule,
    NgOptimizedImage,
    SettingsView,
    LanguageSelectorComponent,
    TitleComponent,
  ],
    providers: [],
    exports: [
        NavbarComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
