import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoServicioRoutingModule } from './tipo-servicio-routing.module';
import { TipoServicioComponent } from './tipo-servicio.component';


@NgModule({
  declarations: [
    TipoServicioComponent
  ],
  imports: [
    CommonModule,
    TipoServicioRoutingModule
  ]
})
export class TipoServicioModule { }
