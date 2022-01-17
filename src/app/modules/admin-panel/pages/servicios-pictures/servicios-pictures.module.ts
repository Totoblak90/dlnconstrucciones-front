import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosPicturesRoutingModule } from './servicios-pictures-routing.module';
import { ServiciosPicturesComponent } from './servicios-pictures.component';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ServiciosPicturesComponent
  ],
  imports: [
    CommonModule,
    ServiciosPicturesRoutingModule,
    ComponentsModule
  ]
})
export class ServiciosPicturesModule { }
