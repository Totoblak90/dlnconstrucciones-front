import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntenasRoutingModule } from './antenas-routing.module';
import { AntenasComponent } from './antenas.component';


@NgModule({
  declarations: [
    AntenasComponent
  ],
  imports: [
    CommonModule,
    AntenasRoutingModule
  ]
})
export class AntenasModule { }
