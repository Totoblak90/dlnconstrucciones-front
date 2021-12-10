import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoteRoutingModule } from './lote-routing.module';
import { LoteComponent } from './lote.component';
import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    LoteComponent
  ],
  imports: [
    CommonModule,
    LoteRoutingModule,
    ComponentsModule
  ]
})
export class LoteModule { }
