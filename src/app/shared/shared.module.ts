import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavBottomComponent } from './nav-bottom/nav-bottom.component';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    NavBottomComponent,
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    NavBottomComponent
  ],
})
export class SharedModule {}
