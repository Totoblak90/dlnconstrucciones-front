import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosContenidosRoutingModule } from './servicios-contenidos-routing.module';
import { ServiciosContenidosComponent } from './servicios-contenidos.component';


@NgModule({
  declarations: [
    ServiciosContenidosComponent
  ],
  imports: [
    CommonModule,
    ServiciosContenidosRoutingModule
  ]
})
export class ServiciosContenidosModule { }
