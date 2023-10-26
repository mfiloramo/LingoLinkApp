import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./views/home/home.component";
import { ChatBoxComponent } from "./components/chat-box/chat-box.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ConvosComponent } from "./components/convos/convos.component";
import { PageNotFoundComponent } from "./views/page-not-found/page-not-found.component";
import { LoginComponent } from "./views/login/login.component";
import { RegistrationComponent } from "./views/registration/registration.component";
import { AuthGuard } from "./guards/auth/auth.guard";

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
    canActivate: [AuthGuard],
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
        canActivate: [],
      },
      {
        path: 'conversations',
        component: ConvosComponent,
        data: { animation: 'conversations' },
        canActivate: [],
      },
      {
        path: 'chat',
        component: ChatBoxComponent,
        data: { animation: 'chat' },
        canActivate: [],
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
