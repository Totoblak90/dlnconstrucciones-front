import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosComponent } from './servicios.component';
import { AntenasComponent } from './antenas/antenas.component';
import { PiscinasComponent } from './piscinas/piscinas.component';
import { ViviendasComponent } from './viviendas/viviendas.component';

const routes: Routes = [
  {
    path: '',
    component: ServiciosComponent,
    pathMatch: 'full',
    children: [
      {
        path: 'antenas',
        component: AntenasComponent
      },
      {
        path: 'piscinas',
        component: PiscinasComponent
      },
      {
        path: 'viviendas',
        component: ViviendasComponent
      },
      {
        path: '**',
        redirectTo: 'servicios'
      }
    ]
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
