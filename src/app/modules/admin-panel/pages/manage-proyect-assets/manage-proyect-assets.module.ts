import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageProyectAssetsRoutingModule } from './manage-proyect-assets-routing.module';
import { ManageProyectAssetsComponent } from './manage-proyect-assets.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [ManageProyectAssetsComponent],
  imports: [
    CommonModule,
    ManageProyectAssetsRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
})
export class ManageProyectAssetsModule {}
