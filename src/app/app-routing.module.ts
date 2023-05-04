import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FollowRequestsComponent } from './follow-requests/follow-requests.component';
import { AuthGuard } from './guards/auth.guard';
import { EditProfileGuard } from './guards/edit-profile.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HomeComponent } from './home/home.component';
import { FollowingFollowersComponent } from './following-followers/following-followers.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';


const routes: Routes = [
  {path: '', component: HomeComponent,data: { showNav: true , showHeader: false, showTopNav: false},
  canActivate: [AuthGuard]},

  {path: 'home', component: HomeComponent,data: { showNav: true , showHeader: false, showTopNav: false},
  canActivate: [AuthGuard]},

  {path: 'login', component: LoginComponent,data: { showNav: false , showHeader: false, showTopNav: false},
  canActivate: [EditProfileGuard]},

  {path: 'signup', component: RegisterComponent,data: { showNav: false , showHeader: false, showTopNav: false},
  canActivate: [EditProfileGuard]},

  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard],
  data: { showNav: true , showHeader: true, showTopNav: false}},

  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] ,
  data: { showNav: false , showHeader: true}},

  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] ,
  data: { showNav: true , showHeader: false,showTopNav:false}},

  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] ,
  data: { showNav: true , showHeader: true,showTopNav:false}},

  { path: 'follow-requests/:type', component: FollowRequestsComponent, canActivate: [AuthGuard] ,
  data: { showNav: true , showHeader: true,showTopNav:false}},

  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] ,
  data: { showNav: true , showHeader: true,showTopNav:false}},

  {path: 'chat',
   loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule),
   data: { showNav: false,showHeader:true,showTopNav:false},canActivate: [AuthGuard]},

   { path: 'follow-list/:type/:userId', component: FollowingFollowersComponent, canActivate: [AuthGuard],
  data: { showNav: true , showHeader: false, showTopNav: false} },
  { path: 'blocked-accounts', component: BlockedUsersComponent, canActivate: [AuthGuard],
  data: { showNav: false , showHeader: true, showTopNav: false} },
  { path: 'send-feedback', component: SendFeedbackComponent, canActivate: [AuthGuard],
  data: { showNav: false , showHeader: true, showTopNav: false} },

  { path: ':username', component: UserProfileComponent, canActivate: [AuthGuard],
  data: { showNav: true , showHeader: false, showTopNav: false} },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

