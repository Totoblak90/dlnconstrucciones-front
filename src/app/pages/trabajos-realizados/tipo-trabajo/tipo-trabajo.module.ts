import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoTrabajoRoutingModule } from './tipo-trabajo-routing.module';
import { TipoTrabajoComponent } from './tipo-trabajo.component';
import { GalleryModule } from 'ng-gallery';

@NgModule({
  declarations: [
    TipoTrabajoComponent
  ],
  imports: [
    CommonModule,
    TipoTrabajoRoutingModule,
    GalleryModule,
  ],
})
export class TipoTrabajoModule { }
