import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ProyectosComponent
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class ProyectosModule { }
