import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./views/home/home.component";
import { MessageBoxComponent } from "./components/message-box/message-box.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ConversationsComponent } from "./components/conversations/conversations.component";
import { PageNotFoundComponent } from "./views/page-not-found/page-not-found.component";
import { LoginComponent } from "./views/login/login.component";
import { RegistrationComponent } from "./views/registration/registration.component";
import { AuthGuard } from "./guards/auth/auth.guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home', // '/login' FOR PROD
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
    canActivate: [ AuthGuard ], // RE-ENABLE FOR PROD
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
      },
      {
        path: 'conversations',
        component: ConversationsComponent,
        data: { animation: 'conversations' },
      },
      {
        path: 'chat',
        component: MessageBoxComponent,
        data: { animation: 'chat' },
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
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
