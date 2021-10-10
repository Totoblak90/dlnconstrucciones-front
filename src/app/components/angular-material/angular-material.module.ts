import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCarouselModule} from '@ngbmodule/material-carousel';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';



@NgModule({
  declarations: [],
  exports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCarouselModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule { }
