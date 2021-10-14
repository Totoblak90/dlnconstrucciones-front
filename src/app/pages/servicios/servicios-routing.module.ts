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
  },
  {
    path: 'viviendas',
    loadChildren: () => import('./viviendas/viviendas.module').then(m => m.ViviendasModule)
  },
  {
    path: 'piscinas',
    loadChildren: () => import('./piscinas/piscinas.module').then(m => m.PiscinasModule)
  },
  {
    path: 'antenas',
    loadChildren: () => import('./antenas/antenas.module').then(m => m.AntenasModule)
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
