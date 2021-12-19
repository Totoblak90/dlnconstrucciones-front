import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotesRoutingModule } from './lotes-routing.module';
import { LotesComponent } from './lotes.component';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LotesComponent
  ],
  imports: [
    CommonModule,
    LotesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class LotesModule { }
