import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('./pages/servicios/servicios.module').then(
            (m) => m.ServiciosModule
          ),
      },
      {
        path: 'lotes',
        loadChildren: () =>
          import('./pages/lotes/lotes.module').then((m) => m.LotesModule),
      },
      {
        path: 'trabajos-realizados',
        loadChildren: () =>
          import('./pages/trabajos-realizados/trabajos-realizados.module').then(
            (m) => m.TrabajosRealizadosModule
          ),
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'main',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
