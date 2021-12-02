import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoServicioRoutingModule } from './tipo-servicio-routing.module';
import { TipoServicioComponent } from './tipo-servicio.component';
import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    TipoServicioComponent
  ],
  imports: [
    CommonModule,
    TipoServicioRoutingModule,
    ComponentsModule
  ]
})
export class TipoServicioModule { }
