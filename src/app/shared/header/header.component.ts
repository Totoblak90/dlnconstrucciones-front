import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/header.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public menu: Menu[] = [
    {
      description: 'INICIO',
      redirectTo: '/home',
      moreOptions: false,
      show: true,
    },
    {
      description: 'SERVICIOS',
      redirectTo: '/servicios',
      moreOptions: false,
      show: true,
    },
    {
      description: 'TRABAJOS REALIZADOS',
      redirectTo: '/trabajos-realizados',
      moreOptions: false,
      show: true,
    },
    {
      description: 'LOTES',
      redirectTo: '/lotes',
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
          redirectTo: '/auth/login',
          show: true,
        },
        {
          description: 'REGISTRARSE',
          redirectTo: '/auth/register',
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
    return this.user?.getAvatar();
  }

  public logout(): void {
    this.authService.logout();
  }
}
