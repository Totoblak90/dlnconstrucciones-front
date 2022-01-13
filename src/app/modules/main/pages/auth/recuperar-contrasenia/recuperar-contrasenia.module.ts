import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecuperarContraseniaRoutingModule } from './recuperar-contrasenia-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RecuperarContraseniaComponent } from './recuperar-contrasenia.component';

@NgModule({
  declarations: [RecuperarContraseniaComponent],
  imports: [
    CommonModule,
    RecuperarContraseniaRoutingModule,
    ReactiveFormsModule,
  ],
})
export class RecuperarContraseniaModule {}
