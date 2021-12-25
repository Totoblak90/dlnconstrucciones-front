import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'lotes',
        loadChildren: () =>
          import('./pages/lotes/lotes.module').then((m) => m.LotesModule),
      },
      {
        path: 'intereses',
        loadChildren: () =>
          import('./pages/intereses/intereses.module').then(
            (m) => m.InteresesModule
          ),
      },
      {
        path: 'proyectos',
        loadChildren: () =>
          import('./pages/proyectos/proyectos.module').then(
            (m) => m.ProyectosModule
          ),
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('./pages/servicios/servicios.module').then(
            (m) => m.ServiciosModule
          ),
      },
      {
        path: 'tipo-de-trabajo',
        loadChildren: () =>
          import('./pages/tipo-de-trabajo/tipo-de-trabajo.module').then(
            (m) => m.TipoDeTrabajoModule
          ),
      },
      {
        path: 'trabajos',
        loadChildren: () =>
          import('./pages/trabajos-realizados/trabajos-realizados.module').then(
            (m) => m.TrabajosRealizadosModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'zonas',
        loadChildren: () =>
          import('./pages/zonas/zonas.module').then((m) => m.ZonasModule),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
