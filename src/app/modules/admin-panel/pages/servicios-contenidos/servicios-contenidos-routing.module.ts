import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosContenidosComponent } from './servicios-contenidos.component';

const routes: Routes = [
  {
    path: '',
    component: ServiciosContenidosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosContenidosRoutingModule {}
