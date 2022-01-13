import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecuperarContraseniaPasoDosRoutingModule } from './recuperar-contrasenia-paso-dos-routing.module';
import { RecuperarContraseniaPasoDosComponent } from './recuperar-contrasenia-paso-dos.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecuperarContraseniaPasoDosComponent],
  imports: [
    CommonModule,
    RecuperarContraseniaPasoDosRoutingModule,
    ReactiveFormsModule,
  ],
})
export class RecuperarContraseniaPasoDosModule {}
