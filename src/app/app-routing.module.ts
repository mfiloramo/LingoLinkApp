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
import { LanguageView } from "./views/settings/language/language.view";
import { AccountView } from "./views/settings/account/account.view";
import { AvatarView } from "./views/settings/avatar/avatar.view";
import { DisplayView } from "./views/settings/display/display.view";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.view";

// GUARD IMPORTS
import { AuthGuard } from "./guards/auth/auth.guard";

// VIEW IMPORTS
import { MainSettingsView } from "./views/settings/main-settings/main-settings.view";
import { AccountInfoView } from "./views/settings/account/account-info/account-info.view";
import { ChangeUsernameView } from "./views/settings/account/change-username/change-username.view";
import { ChangeNameView } from "./views/settings/account/change-name/change-name.view";
import { ChangeEmailView } from "./views/settings/account/change-email/change-email.view";
import { DeleteAccountView } from "./views/settings/account/delete-account/delete-account.view";
import { ChangePasswordView } from "./views/settings/account/change-password/change-password.view";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', // PROD: '/login'
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
        canActivate: [ AuthGuard ],
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'main-settings',
            data: { animation: 'registration' }
          },
          {
            path: 'main-settings',
            component: MainSettingsView,
            canActivate: [ AuthGuard ],
            data: { animation: 'main-settings' }
          },
          {
            path: 'account',
            component: AccountView,
            canActivate: [ AuthGuard ],
            data: { animation: 'account' },
            children: [
              {
                path: 'account-info',
                component: AccountInfoView,
                canActivate: [ AuthGuard ],
                data: { animation: 'account-info' }
              },
                {
                  path: 'change-username',
                  component: ChangeUsernameView,
                  canActivate: [AuthGuard],
                  data: { animation: 'change-username' }
                },
                {
                  path: 'change-name',
                  component: ChangeNameView,
                  canActivate: [AuthGuard],
                  data: { animation: 'change-name' }
                },
                {
                  path: 'change-email',
                  component: ChangeEmailView,
                  canActivate: [AuthGuard],
                  data: { animation: 'change-email' }
                },
                {
                  path: 'change-password',
                  component: ChangePasswordView,
                  canActivate: [ AuthGuard ],
                  data: { animation: 'change-password' }
                },
                {
                  path: 'delete-account',
                  component: DeleteAccountView,
                  canActivate: [AuthGuard],
                  data: { animation: 'delete-account' }
                }
            ]
          },
          {
            path: 'avatar',
            component: AvatarView,
            canActivate: [ AuthGuard ],
            data: { animation: 'avatar' }
          },
          {
            path: 'display',
            component: DisplayView,
            canActivate: [ AuthGuard ],
            data: { animation: 'display' }
          },
          {
            path: 'language',
            component: LanguageView,
            canActivate: [ AuthGuard ],
            data: { animation: 'language' }
          }
        ]
      }
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
