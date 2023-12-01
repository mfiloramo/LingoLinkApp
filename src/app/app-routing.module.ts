import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatView } from "./views/chat/chat.view";
import { MessageBoxComponent } from "./components/message-box/message-box.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ConversationsComponent } from "./components/conversations/conversations.component";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.view";
import { LoginView } from "./views/login/login.view";
import { RegistrationView } from "./views/registration/registration.view";
import { AuthGuard } from "./guards/auth/auth.guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat', // PROD: '/login' | DEV: '/chat'
    pathMatch: 'full'
  },
  {
    path: 'registration',
    component: RegistrationView,
    data: { animation: 'registration' }
  },
  {
    path: 'chat',
    component: ChatView,
    data: { animation: 'chat' },
    // canActivate: [ AuthGuard ], // ENABLED FOR PROD
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
    component: LoginView,
    data: { animation: 'login' }
  },
  {
    path: '**',
    component: PageNotFoundView,
    data: { animation: 'pageNotFound' }
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
