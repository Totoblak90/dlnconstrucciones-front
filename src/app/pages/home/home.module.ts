import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { ModalComponent } from './modal/modal.component';
import { CarouselComponent } from './components/carousel/carousel.component';


@NgModule({
  declarations: [
    HomeComponent,
    ModalComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentsModule,
  ],
  exports: [CarouselComponent]
})
export class HomeModule { }
