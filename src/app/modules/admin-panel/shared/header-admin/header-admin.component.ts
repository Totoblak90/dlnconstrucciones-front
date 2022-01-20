import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/modules/main/interfaces/header.interface';
import { UserStoreService } from '../../../../services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent implements OnInit {
  public user = this.userStore.loggedUser$;
  public userAvatar: string | undefined;
  public userName: string | undefined;
  public userLastName: string | undefined;
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
      description: 'Proyectos',
      toggle: true,
      redirectTo: '/admin/proyectos',
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

  constructor(private userStore: UserStoreService) {}

  ngOnInit(): void {
    this.user.subscribe((res) => {
      if (res.id) {
        if (res.role !== 'master') {
          this.menu = this.menu.filter(
            (item) =>
              item.description !== 'Proyectos' &&
              item.description !== 'Usuarios'
          );
        }
        this.userName = res.nombre;
        this.userLastName = res.apellido;
        this.userAvatar = `${environment.API_IMAGE_URL}/users/${res.avatar}`;
      }
    });
  }
}
