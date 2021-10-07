import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { MatCarouselModule } from '@ngbmodule/material-carousel';



@NgModule({
  declarations: [],
  exports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCarouselModule
  ]
})
export class AngularMaterialModule { }
