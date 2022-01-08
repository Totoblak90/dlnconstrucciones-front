import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageProyectAssetsComponent } from './manage-proyect-assets.component';

const routes: Routes = [
  {
    path: '',
    component: ManageProyectAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageProyectAssetsRoutingModule {}
