import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoTrabajoRoutingModule } from './tipo-trabajo-routing.module';
import { TipoTrabajoComponent } from './tipo-trabajo.component';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    TipoTrabajoComponent
  ],
  imports: [
    CommonModule,
    TipoTrabajoRoutingModule,
    ComponentsModule
  ],
})
export class TipoTrabajoModule { }
