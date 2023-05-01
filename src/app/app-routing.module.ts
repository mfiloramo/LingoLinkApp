import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ConvosComponent } from "./convos/convos.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { animation: 'registration' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' },
    // canActivate: [MsalGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: NavbarComponent,
        data: { animation: 'profile' },
        // canActivate: [MsalGuard],
      },
      {
        path: 'conversations',
        component: ConvosComponent,
        data: { animation: 'conversations' },
        // canActivate: [MsalGuard],
      },
      {
        path: 'chat',
        component: ChatBoxComponent,
        data: { animation: 'chat' },
        // canActivate: [MsalGuard],
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' }
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { animation: 'pageNotFound' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
