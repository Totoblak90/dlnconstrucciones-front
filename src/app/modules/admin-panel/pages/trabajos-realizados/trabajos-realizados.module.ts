import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajosRealizadosRoutingModule } from './trabajos-realizados-routing.module';
import { TrabajosRealizadosComponent } from './trabajos-realizados.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TrabajosRealizadosComponent
  ],
  imports: [
    CommonModule,
    TrabajosRealizadosRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class TrabajosRealizadosModule { }
