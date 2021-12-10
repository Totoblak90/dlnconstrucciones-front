import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components.module';
import { ServiciosRoutingModule } from './servicios-routing.module';

import { ServiciosComponent } from './servicios.component';

@NgModule({
  declarations: [
    ServiciosComponent,
  ],
  imports: [
    CommonModule,
    ServiciosRoutingModule,
    ComponentsModule
  ]
})
export class ServiciosModule { }
