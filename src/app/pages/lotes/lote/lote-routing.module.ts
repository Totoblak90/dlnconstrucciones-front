import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoteComponent } from './lote.component';

const routes: Routes = [{
  path: '',
  component: LoteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoteRoutingModule { }
