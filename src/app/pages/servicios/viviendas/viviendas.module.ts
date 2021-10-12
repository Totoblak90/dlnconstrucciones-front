import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViviendasRoutingModule } from './viviendas-routing.module';
import { ViviendasComponent } from './viviendas.component';


@NgModule({
  declarations: [
    ViviendasComponent
  ],
  imports: [
    CommonModule,
    ViviendasRoutingModule
  ]
})
export class ViviendasModule { }
