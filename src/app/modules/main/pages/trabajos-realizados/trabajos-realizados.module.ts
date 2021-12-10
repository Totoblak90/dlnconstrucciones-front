import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajosRealizadosRoutingModule } from './trabajos-realizados-routing.module';
import { ComponentsModule } from '../../components/components.module';
import { TrabajosRealizadosComponent } from './trabajos-realizados.component';


@NgModule({
  declarations: [TrabajosRealizadosComponent],
  imports: [
    CommonModule,
    TrabajosRealizadosRoutingModule,
    ComponentsModule
  ]
})
export class TrabajosRealizadosModule { }
