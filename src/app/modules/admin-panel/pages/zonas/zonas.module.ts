import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonasRoutingModule } from './zonas-routing.module';
import { ZonasComponent } from './zonas.component';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ZonasComponent
  ],
  imports: [
    CommonModule,
    ZonasRoutingModule,
    ComponentsModule
  ]
})
export class ZonasModule { }
