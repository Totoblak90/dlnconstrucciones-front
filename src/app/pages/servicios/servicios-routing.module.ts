import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosComponent } from './servicios.component';

const routes: Routes = [
  {
    path: '',
    component: ServiciosComponent,
    pathMatch: 'full',
  },
  {
    path: ':tipo-servicio',
    loadChildren: () => import('./tipo-servicio/tipo-servicio.module').then(m => m.TipoServicioModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
