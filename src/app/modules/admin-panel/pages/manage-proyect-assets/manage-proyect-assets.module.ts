import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageProyectAssetsRoutingModule } from './manage-proyect-assets-routing.module';
import { ManageProyectAssetsComponent } from './manage-proyect-assets.component';


@NgModule({
  declarations: [ManageProyectAssetsComponent],
  imports: [
    CommonModule,
    ManageProyectAssetsRoutingModule
  ]
})
export class ManageProyectAssetsModule { }
