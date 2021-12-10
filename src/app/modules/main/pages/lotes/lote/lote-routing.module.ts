import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoteComponent } from './lote.component';

const routes: Routes = [
  {
    path: '',
    component: LoteComponent,
  },
  {
    path: 'detalle/:lote_id',
    loadChildren: () =>
      import('./detalle-lote/detalle-lote.module').then(
        (m) => m.DetalleLoteModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoteRoutingModule {}
