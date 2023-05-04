import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageWindowComponent } from './message-window/message-window.component';

const routes: Routes = [
  { path: '',  component: MessageListComponent,
  data: { showNav: false,showHeader:true,showTopNav:false} ,canActivate: [AuthGuard] },

  { path: 'chat/:username',  component: MessageWindowComponent,
  data: { showNav: false,showHeader:false,showTopNav:false} ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
