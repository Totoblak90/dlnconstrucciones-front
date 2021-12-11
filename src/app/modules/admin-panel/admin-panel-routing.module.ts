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
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'trabajos',
        loadChildren: () =>
          import('./pages/trabajos-realizados/trabajos-realizados.module').then(
            (m) => m.TrabajosRealizadosModule
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
        path: 'lotes',
        loadChildren: () =>
          import('./pages/lotes/lotes.module').then(
            (m) => m.LotesModule
          ),
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
