// CORE MODULE IMPORTS
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT IMPORTS
import { MessagesComponent } from "./components/messages/messages.component";
import { ConversationsComponent } from "./components/conversations/conversations.component";
import { ContactsComponent } from "./components/contacts/contacts.component";

// VIEW IMPORTS
import { LoginView } from "./views/login/login.view";
import { RegistrationView } from "./views/registration/registration.view";
import { HomeView } from "./views/home/home.view";
import { SettingsView } from "./views/settings/settings.view";
import { LanguageView } from "./views/language/language.view";
import { AccountView } from "./views/account/account.view";
import { AvatarView } from "./views/avatar/avatar.view";
import { DisplayView } from "./views/display/display.view";
import { InfoView } from "./views/info/info.view";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.view";

// GUARD IMPORTS
import { AuthGuard } from "./guards/auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/contacts', // PROD: '/login' | DEV: '/home'
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
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'conversations',
        data: { animation: 'conversations' },
      },
      {
        path: 'conversations',
        component: ConversationsComponent,
        data: { animation: 'conversations' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'chat',
        component: MessagesComponent,
        data: { animation: 'chat' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'contacts',
        component: ContactsComponent,
        data: { animation: 'contacts' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'settings',
        component: SettingsView,
        data: { animation: 'settings' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'account',
        component: AccountView,
        data: { animation: 'account' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'avatar',
        component: AvatarView,
        data: { animation: 'avatar' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'display',
        component: DisplayView,
        data: { animation: 'display' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'language',
        component: LanguageView,
        data: { animation: 'language' },
        canActivate: [ AuthGuard ],
      },
      {
        path: 'info',
        component: InfoView,
        data: { animation: 'info' },
        canActivate: [ AuthGuard ],
      },
    ]
  },
  {
    path: 'login',
    component: LoginView,
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
