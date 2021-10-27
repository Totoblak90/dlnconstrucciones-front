import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoTrabajoRoutingModule } from './tipo-trabajo-routing.module';
import { TipoTrabajoComponent } from './tipo-trabajo.component';


@NgModule({
  declarations: [
    TipoTrabajoComponent
  ],
  imports: [
    CommonModule,
    TipoTrabajoRoutingModule
  ]
})
export class TipoTrabajoModule { }
