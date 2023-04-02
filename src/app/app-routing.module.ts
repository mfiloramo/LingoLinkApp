import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { ProfileComponent } from "./profile/profile.component";


const routes: Routes = [
  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'chat',
        component: ChatBoxComponent,
        // canActivate: [MsalGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        // canActivate: [MsalGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
