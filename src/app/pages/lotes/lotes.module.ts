import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotesRoutingModule } from './lotes-routing.module';
import { LotesComponent } from './lotes.component';


@NgModule({
  declarations: [
    LotesComponent
  ],
  imports: [
    CommonModule,
    LotesRoutingModule
  ]
})
export class LotesModule { }
