import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeView } from "./views/home/home.view";
import { MessageBoxComponent } from "./components/message-box/message-box.component";
import { ConversationsComponent } from "./components/conversations/conversations.component";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.view";
import { LoginView } from "./views/login/login.view";
import { RegistrationView } from "./views/registration/registration.view";
import { AuthGuard } from "./guards/auth/auth.guard";
import { SettingsView } from "./views/settings/settings.view";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', // PROD: '/login' | DEV: '/home'
    pathMatch: 'full'
  },
  {
    path: 'registration',
    component: RegistrationView,
    data: { animation: 'registration' }
  },
  {
    path: 'home',
    component: HomeView,
    data: { animation: 'home' },
    canActivate: [ AuthGuard ], // ENABLE FOR PROD
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
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
      },
      {
        path: 'settings',
        component: SettingsView,
        data: { animation: 'settings' }
      }
    ]
  },
  {
    path: 'login',
    component: LoginView,
    data: { animation: 'login' }
  },
  {
    path: '**',
    component: PageNotFoundView,
    data: { animation: 'pageNotFound' }
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
