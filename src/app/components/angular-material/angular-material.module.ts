import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCarouselModule} from '@ngbmodule/material-carousel';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [],
  exports: [
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatCarouselModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule
  ]
})
export class AngularMaterialModule { }
