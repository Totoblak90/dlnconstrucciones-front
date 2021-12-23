import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteresesRoutingModule } from './intereses-routing.module';
import { InteresesComponent } from './intereses.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InteresesComponent
  ],
  imports: [
    CommonModule,
    InteresesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class InteresesModule { }
