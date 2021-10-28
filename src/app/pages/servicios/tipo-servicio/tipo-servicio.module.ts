import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoServicioRoutingModule } from './tipo-servicio-routing.module';
import { TipoServicioComponent } from './tipo-servicio.component';
import { GalleryModule } from 'ng-gallery';


@NgModule({
  declarations: [
    TipoServicioComponent
  ],
  imports: [
    CommonModule,
    TipoServicioRoutingModule,
    GalleryModule
  ]
})
export class TipoServicioModule { }
