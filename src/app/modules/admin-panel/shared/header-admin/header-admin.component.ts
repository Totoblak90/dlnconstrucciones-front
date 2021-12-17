import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Menu } from 'src/app/modules/main/interfaces/header.interface';
import { AuthService } from '../../../main/services/auth.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent {
  public showMenu: boolean = false;
  public menu: Menu[] = [
    {
      description: 'Dashboard',
      toggle: true,
      redirectTo: '/admin/dashboard',
      inMobile: true,
    },
    {
      description: 'Intereses',
      toggle: true,
      redirectTo: '/admin/intereses',
      inMobile: true,
    },
    {
      description: 'Lotes',
      toggle: true,
      redirectTo: '/admin/lotes',
      inMobile: true,
    },
    {
      description: 'Servicios',
      toggle: true,
      redirectTo: '/admin/servicios',
      inMobile: true,
    },
    {
      description: 'Tipo de trabajo',
      toggle: true,
      redirectTo: '/admin/tipo-de-trabajo',
      inMobile: true,
    },
    {
      description: 'Trabajos Realizados',
      toggle: true,
      redirectTo: '/admin/trabajos',
      inMobile: true,
    },
    {
      description: 'Usuarios',
      toggle: true,
      redirectTo: '/admin/users',
      inMobile: true,
    },
    {
      description: 'Zonas',
      toggle: true,
      redirectTo: '/admin/zonas',
      inMobile: true,
    },
    {
      description: 'Salir',
      redirectTo: '/main/home',
      toggle: true,
      inMobile: true,
    },
  ];

  constructor(private authService: AuthService) {}

  public get user(): User {
    return this.authService.getUser();
  }

  public getUserImg(): string {
    return this.user ? this.user?.getAvatar() : '';
  }
}
