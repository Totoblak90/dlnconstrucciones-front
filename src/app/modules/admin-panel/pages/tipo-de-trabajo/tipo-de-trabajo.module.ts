import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoDeTrabajoRoutingModule } from './tipo-de-trabajo-routing.module';
import { TipoDeTrabajoComponent } from './tipo-de-trabajo.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TipoDeTrabajoComponent
  ],
  imports: [
    CommonModule,
    TipoDeTrabajoRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class TipoDeTrabajoModule { }
