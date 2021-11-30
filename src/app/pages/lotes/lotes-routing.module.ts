import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotesComponent } from './lotes.component';

const routes: Routes = [
  {
    path: '',
    component: LotesComponent
  },
  {
    path: ':loteId',
    loadChildren: () => import('./lote/lote.module').then(m => m.LoteModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotesRoutingModule { }
