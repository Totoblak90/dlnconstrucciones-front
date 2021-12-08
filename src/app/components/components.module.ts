import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PresentationCardComponent } from './presentation-card/presentation-card.component';



@NgModule({
  declarations: [
    PresentationCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PresentationCardComponent
  ]
})
export class ComponentsModule { }
