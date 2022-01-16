import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminGuard } from './guards/admin.guard';
import { MasterGuard } from './guards/master.guard';

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
        canActivate: [MasterGuard],
        canLoad: [MasterGuard],
        loadChildren: () =>
          import('./pages/proyectos/proyectos.module').then(
            (m) => m.ProyectosModule
          ),
      },
      {
        path: 'proyectos/payments',
        canActivate: [MasterGuard],
        canLoad: [MasterGuard],
        loadChildren: () =>
          import('./pages/payments/payments.module').then(
            (m) => m.PaymentsModule
          ),
      },
      {
        path: 'proyectos/assets',
        canActivate: [MasterGuard],
        canLoad: [MasterGuard],
        loadChildren: () =>
          import(
            './pages/manage-proyect-assets/manage-proyect-assets.module'
          ).then((m) => m.ManageProyectAssetsModule),
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('./pages/servicios/servicios.module').then(
            (m) => m.ServiciosModule
          ),
      },
      {
        path: 'servicios/contenidos',
        loadChildren: () =>
          import(
            './pages/servicios-contenidos/servicios-contenidos.module'
          ).then((m) => m.ServiciosContenidosModule),
      },
      {
        path: 'servicios/pictures',
        loadChildren: () =>
          import('./pages/servicios-pictures/servicios-pictures.module').then(
            (m) => m.ServiciosPicturesModule
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
        canActivate: [MasterGuard],
        canLoad: [MasterGuard],
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
