import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosPicturesRoutingModule } from './servicios-pictures-routing.module';
import { ServiciosPicturesComponent } from './servicios-pictures.component';


@NgModule({
  declarations: [
    ServiciosPicturesComponent
  ],
  imports: [
    CommonModule,
    ServiciosPicturesRoutingModule
  ]
})
export class ServiciosPicturesModule { }
