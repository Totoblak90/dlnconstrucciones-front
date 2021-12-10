import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';


import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
