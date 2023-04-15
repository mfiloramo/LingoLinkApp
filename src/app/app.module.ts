import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from "@angular/material/expansion";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgChatModule } from 'ng-chat';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from "@angular/material/grid-list";
import { ConvosComponent } from './convos/convos.component';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationComponent } from './registration/registration.component';
import { MatRadioModule } from "@angular/material/radio";
import { _MatCheckboxRequiredValidatorModule } from "@angular/material/checkbox";
import { AppConfigService } from '../services/app-config.service';


@NgModule({
  declarations: [
    AppComponent,
    ChatBoxComponent,
    ProfileComponent,
    HomeComponent,
    ConvosComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    MatExpansionModule,
    FormsModule,
    NgChatModule,
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
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appConfigService: AppConfigService) => () => appConfigService.loadAppConfig(),
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
