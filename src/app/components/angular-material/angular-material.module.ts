import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule
  ],
  exports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class AngularMaterialModule { }
