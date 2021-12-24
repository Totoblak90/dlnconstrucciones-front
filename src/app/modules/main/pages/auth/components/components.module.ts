import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectsComponent } from './proyects/proyects.component';

@NgModule({
  declarations: [ProyectsComponent],
  imports: [CommonModule],
  exports: [ProyectsComponent],
})
export class ComponentsModule {}
