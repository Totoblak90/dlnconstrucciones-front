import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecuperarContraseniaPasoDosComponent } from './recuperar-contrasenia-paso-dos.component';

const routes: Routes = [
  {
    path: '',
    component: RecuperarContraseniaPasoDosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarContraseniaPasoDosRoutingModule {}
