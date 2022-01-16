import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosPicturesComponent } from './servicios-pictures.component';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPicturesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPicturesRoutingModule {}
