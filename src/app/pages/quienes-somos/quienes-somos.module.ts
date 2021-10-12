import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../components/components.module';
import { QuienesSomosRoutingModule } from './quienes-somos-routing.module';
import { QuienesSomosComponent } from './quienes-somos.component';



@NgModule({
  declarations: [QuienesSomosComponent],
  imports: [
    CommonModule,
    QuienesSomosRoutingModule,
    ComponentsModule
  ]
})
export class QuienesSomosModule { }
