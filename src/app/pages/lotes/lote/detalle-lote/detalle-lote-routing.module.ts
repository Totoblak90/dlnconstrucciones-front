import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleLoteComponent } from './detalle-lote.component';

const routes: Routes = [{
  path: '',
  component: DetalleLoteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleLoteRoutingModule { }
