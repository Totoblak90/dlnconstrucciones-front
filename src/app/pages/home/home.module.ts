import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    HomeComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentsModule,
  ]
})
export class HomeModule { }
