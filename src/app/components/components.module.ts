import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { RouterModule } from '@angular/router';
import { PresentationCardComponent } from './presentation-card/presentation-card.component';



@NgModule({
  declarations: [
    PresentationCardComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule
  ],
  exports: [
    AngularMaterialModule,
    PresentationCardComponent
  ]
})
export class ComponentsModule { }
