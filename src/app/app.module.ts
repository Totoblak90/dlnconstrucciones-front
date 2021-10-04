import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { QuienesSomosComponent } from './pages/quienes-somos/quienes-somos.component';
import { TrabajosRealizadosComponent } from './pages/trabajos-realizados/trabajos-realizados.component';

@NgModule({
  declarations: [
    AppComponent,
    QuienesSomosComponent,
    TrabajosRealizadosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
