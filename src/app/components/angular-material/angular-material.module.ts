import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';



@NgModule({
  declarations: [],
  exports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule
  ]
})
export class AngularMaterialModule { }
