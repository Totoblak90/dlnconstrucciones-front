import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteresesRoutingModule } from './intereses-routing.module';
import { InteresesComponent } from './intereses.component';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    InteresesComponent
  ],
  imports: [
    CommonModule,
    InteresesRoutingModule,
    ComponentsModule
  ]
})
export class InteresesModule { }
