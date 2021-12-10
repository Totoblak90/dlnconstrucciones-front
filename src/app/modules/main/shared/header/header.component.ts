import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Menu } from '../../interfaces/header.interface';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public menu: Menu[] = [
    {
      description: 'INICIO',
      redirectTo: '/main/home',
      moreOptions: false,
      show: true,
    },
    {
      description: 'SERVICIOS',
      redirectTo: '/main/servicios',
      moreOptions: false,
      show: true,
    },
    {
      description: 'TRABAJOS REALIZADOS',
      redirectTo: '/main/trabajos-realizados',
      moreOptions: false,
      show: true,
    },
    {
      description: 'LOTES',
      redirectTo: '/main/lotes',
      moreOptions: false,
      show: true,
    },
    {
      description: 'ACREDITARSE',
      moreOptions: true,
      show: true,
      subMenu: [
        {
          description: 'INICIAR SESIÓN',
          redirectTo: '/main/auth/login',
          show: true,
        },
        {
          description: 'REGISTRARSE',
          redirectTo: '/main/auth/register',
          show: true,
        },
      ],
    },
  ];

  private _acreditarse: Menu = {
    description: 'ACREDITARSE',
    moreOptions: true,
    show: true,
    subMenu: [
      {
        description: 'INICIAR SESIÓN',
        redirectTo: '/auth/login',
        show: true,
      },
      {
        description: 'REGISTRARSE',
        redirectTo: '/auth/register',
        show: true,
      },
    ],
  };

  constructor(private authService: AuthService, private router: Router) {}

  public get user(): User {
    if (this.authService.getUser()) {
      this.menu = this.menu.filter(
        (menuItems) => menuItems.description !== 'ACREDITARSE'
      );
    } else {
      if (!this.menu.find(menuItem => menuItem.description === 'ACREDITARSE')) {
        this.menu.push(this._acreditarse)
      }
    }
    return this.authService.getUser();
  }

  public getUserImg(): string {
    return this.user ? this.user?.getAvatar() : '';
  }
}
