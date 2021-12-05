import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleLoteRoutingModule } from './detalle-lote-routing.module';
import { DetalleLoteComponent } from './detalle-lote.component';


@NgModule({
  declarations: [
    DetalleLoteComponent
  ],
  imports: [
    CommonModule,
    DetalleLoteRoutingModule,
  ]
})
export class DetalleLoteModule { }
