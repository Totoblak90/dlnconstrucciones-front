import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PresentationCardComponent } from './presentation-card/presentation-card.component';
import { WheelModalComponent } from './wheel-modal/wheel-modal.component';



@NgModule({
  declarations: [
    PresentationCardComponent,
    WheelModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PresentationCardComponent,
    WheelModalComponent
  ]
})
export class ComponentsModule { }
