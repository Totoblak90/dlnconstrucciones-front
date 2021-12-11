import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Menu } from 'src/app/modules/main/interfaces/header.interface';
import { AuthService } from '../../../main/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public menu: Menu[] = [
    {
      description: 'Dashboard',
      show: true,
      redirectTo: '/admin/dashboard',
    },
    {
      description: 'Usuarios',
      show: true,
      redirectTo: '/admin/users',
    },
    {
      description: 'Servicios',
      show: true,
      redirectTo: '/admin/servicios',
    },
    {
      description: 'Trabajos Realizados',
      show: true,
      redirectTo: '/admin/trabajos',
    },
    {
      description: 'Lotes',
      show: true,
      redirectTo: '/admin/lotes',
    },
    {
      description: 'Salir',
      redirectTo: '/main/home',
      show: true
    }
  ]
  constructor(private authService: AuthService) { }

  public get user(): User {
    return this.authService.getUser();
  }

  public getUserImg(): string {
    return this.user ? this.user?.getAvatar() : '';
  }

}
