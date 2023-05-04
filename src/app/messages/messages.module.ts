import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageWindowComponent } from './message-window/message-window.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MessageListComponent,
    MessageWindowComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  exports: [
    MessageListComponent,
    MessageWindowComponent,
    
]
})
export class MessagesModule { }
