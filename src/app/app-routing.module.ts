import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { ProfileComponent } from "./profile/profile.component";
import { ConvosComponent } from "./convos/convos.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { LoginComponent } from "./login/login.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        // canActivate: [MsalGuard],
      },
      {
        path: 'conversations',
        component: ConvosComponent,
        // canActivate: [MsalGuard],
      },
      {
        path: 'chat',
        component: ChatBoxComponent,
        // canActivate: [MsalGuard],
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
