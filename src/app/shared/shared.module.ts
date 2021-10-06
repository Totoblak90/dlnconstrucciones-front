import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SplashScreenComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SplashScreenComponent
  ]
})
export class SharedModule { }
