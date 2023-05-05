import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { HttpClientModule,HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule  } from "@angular/material/tabs";
import { MatIconModule  } from "@angular/material/icon";

import { WebsocketService} from './services/websocket.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TokenInterceptor } from "./interceptor/token.interceptor";
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MessagesModule } from './messages/messages.module';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';

import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { FollowRequestsComponent } from './follow-requests/follow-requests.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HomeComponent } from './home/home.component';
import { FollowingFollowersComponent } from './following-followers/following-followers.component';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserProfileComponent,
    RegisterComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    SearchComponent,
    SettingsComponent,
    FollowRequestsComponent,
    NotificationsComponent,
    HomeComponent,
    FollowingFollowersComponent,
    BlockedUsersComponent,
    SendFeedbackComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MessagesModule,
    FormsModule,
    SharedModule,
  ],
  providers: [DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
