import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDeTrabajoComponent } from './tipo-de-trabajo.component';

const routes: Routes = [{
  path: '',
  component: TipoDeTrabajoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoDeTrabajoRoutingModule { }
