import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../interfaces/header.interface';
import { User } from 'src/app/models/user.model';
import { UserStoreService } from '../../../../services/user-store.service';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  public menu: Menu[] = [
    {
      description: 'INICIO',
      redirectTo: '/main/home',
      moreOptions: false,
      toggle: true,
      inMobile: true,
    },
    {
      description: 'SERVICIOS',
      redirectTo: '/main/servicios',
      moreOptions: false,
      toggle: true,
      inMobile: true,
    },
    {
      description: 'TRABAJOS REALIZADOS',
      redirectTo: '/main/trabajos-realizados',
      moreOptions: false,
      toggle: true,
      inMobile: true,
    },
    {
      description: 'LOTES',
      redirectTo: '/main/lotes',
      moreOptions: false,
      toggle: true,
      inMobile: true,
    },
    {
      description: 'CUENTA',
      moreOptions: true,
      toggle: true,
      inMobile: false,
      subMenu: [
        {
          description: 'INICIAR SESIÓN',
          redirectTo: '/main/auth/login',
          toggle: true,
          inMobile: true,
        },
        {
          description: 'REGISTRARSE',
          redirectTo: '/main/auth/register',
          toggle: true,
          inMobile: true,
        },
      ],
    },
  ];

  private destroy$: Subject<boolean> = new Subject();

  private _acreditarse: Menu = {
    description: 'CUENTA',
    moreOptions: true,
    toggle: true,
    inMobile: true,
    subMenu: [
      {
        description: 'INICIAR SESIÓN',
        redirectTo: '/main/auth/login',
        toggle: true,
        icon: 'ti-user',
        inMobile: true,
      },
      {
        description: 'REGISTRARSE',
        redirectTo: '/main/auth/register',
        toggle: true,
        icon: 'ti-plus',
        inMobile: true,
      },
    ],
  };

  public user: User | undefined;
  public userAvatar: string | undefined;

  constructor(private userStore: UserStoreService, private router: Router) {
    this.setComponentFunctionality();
  }

  private setComponentFunctionality(): void {
    this.userStore.loggedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        res.id ? (this.user = res) : (this.user = undefined);
        if (this.user) {
          this.userAvatar = `${environment.API_IMAGE_URL}/users/${this.user.avatar}`;
          this.menu = this.menu.filter(
            (menuItems) => menuItems.description !== 'CUENTA'
          );
        } else {
          if (
            !this.menu.find((menuItem) => menuItem.description === 'CUENTA')
          ) {
            this.menu.push(this._acreditarse);
          }
        }
      });
  }

  public login(): void {
    this.router.navigateByUrl('main/auth/login');
  }

  public register(): void {
    this.router.navigateByUrl('main/auth/register');
  }

  public logout(): void {
    this.userStore.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
