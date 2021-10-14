import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntenasComponent } from './antenas.component';

const routes: Routes = [
  {
    path: '',
    component: AntenasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntenasRoutingModule { }
