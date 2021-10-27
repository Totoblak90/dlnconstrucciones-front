import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoTrabajoComponent } from './tipo-trabajo.component';

const routes: Routes = [
  {
    path: '',
    component: TipoTrabajoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoTrabajoRoutingModule { }
