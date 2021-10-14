import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PiscinasComponent } from './piscinas.component';

const routes: Routes = [
  {
    path: '',
    component: PiscinasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiscinasRoutingModule { }
