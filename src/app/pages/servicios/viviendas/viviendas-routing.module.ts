import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViviendasComponent } from './viviendas.component';

const routes: Routes = [
  {
    path: '',
    component: ViviendasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViviendasRoutingModule { }
