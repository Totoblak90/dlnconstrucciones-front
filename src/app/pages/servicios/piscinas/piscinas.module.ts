import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiscinasRoutingModule } from './piscinas-routing.module';
import { PiscinasComponent } from './piscinas.component';


@NgModule({
  declarations: [
    PiscinasComponent
  ],
  imports: [
    CommonModule,
    PiscinasRoutingModule
  ]
})
export class PiscinasModule { }
