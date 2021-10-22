import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoServicioComponent } from './tipo-servicio.component';

const routes: Routes = [
  {
    path: '',
    component: TipoServicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoServicioRoutingModule { }
