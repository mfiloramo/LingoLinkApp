import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Home } from './views/home/home';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageNotFoundView } from './views/page-not-found/page-not-found.view';
import { LoginView } from './views/login/login.view';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationView } from './views/registration/registration.view';
import { MatRadioModule } from '@angular/material/radio';
import { _MatCheckboxRequiredValidatorModule } from '@angular/material/checkbox';
import { environment } from '../environments/environment';
import { SettingsView } from "./views/settings/settings.view";

const protectedResourceMap: any = environment.production
  ? [[environment.apiBaseUrl, [`api://lingolink-api/general`]]]
  : [[environment.apiBaseUrl, [`${environment.apiBaseUrl}/.default`]]];


@NgModule({
    declarations: [
        AppComponent,
        MessageBoxComponent,
        NavbarComponent,
        Home,
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
