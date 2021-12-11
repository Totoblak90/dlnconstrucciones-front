import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderAdminComponent } from './header-admin/header-admin.component';



@NgModule({
  declarations: [
    HeaderAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderAdminComponent,
  ]
})
export class SharedModule { }
