import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrabajosRealizadosComponent } from './trabajos-realizados.component';

const routes: Routes = [
  {
    path: '',
    component: TrabajosRealizadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajosRealizadosRoutingModule { }
