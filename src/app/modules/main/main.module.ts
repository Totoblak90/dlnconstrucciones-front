import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule,
    ComponentsModule,
    SharedModule
  ]
})
export class MainModule { }
