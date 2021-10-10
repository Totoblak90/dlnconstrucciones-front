import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';


import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SplashScreenComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SplashScreenComponent,
  ]
})
export class SharedModule { }
