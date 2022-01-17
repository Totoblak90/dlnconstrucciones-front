import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosContenidosRoutingModule } from './servicios-contenidos-routing.module';
import { ServiciosContenidosComponent } from './servicios-contenidos.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ServiciosContenidosComponent
  ],
  imports: [
    CommonModule,
    ServiciosContenidosRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class ServiciosContenidosModule { }
