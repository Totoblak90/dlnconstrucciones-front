import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonasRoutingModule } from './zonas-routing.module';
import { ZonasComponent } from './zonas.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ZonasComponent
  ],
  imports: [
    CommonModule,
    ZonasRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class ZonasModule { }
