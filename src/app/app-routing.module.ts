import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeView } from "./views/home/home.view";
import { MessagesComponent } from "./components/messages/messages.component";
import { ConversationsComponent } from "./components/conversations/conversations.component";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.view";
import { LoginView } from "./views/login/login.view";
import { RegistrationView } from "./views/registration/registration.view";
import { AuthGuard } from "./guards/auth/auth.guard";
import { SettingsView } from "./views/settings/settings.view";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";


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
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'conversations'
      },
      {
        path: 'conversations',
        component: ConversationsComponent,
        canActivate: [ AuthGuard ],
        data: { animation: 'conversations' }
      },
      {
        path: 'chat',
        component: MessagesComponent,
        canActivate: [ AuthGuard ],
      },
      {
        path: 'contacts',
        component: ContactsComponent,
        canActivate: [ AuthGuard ],
      },
      {
        path: 'settings',
        component: SettingsView,
        canActivate: [ AuthGuard ],
      },
      {
        path: 'language',
        component: LanguageSelectorComponent,
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
