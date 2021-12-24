import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class UserProfileModule { }
