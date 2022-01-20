import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { getToken } from './modules/main/helpers/functions.helper';
import { AuthService } from './modules/main/services/auth.service';
import { User } from './models/user.model';
import {
  IdentifyTokenOActualizarUsuario,
  UserData,
} from './modules/main/interfaces/http/auth.interface';
import Swal from 'sweetalert2';
import { UserStoreService } from './services/user-store.service';

declare function customInitFunctions(): void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private userStore: UserStoreService
  ) {
    customInitFunctions();
    this.loguearUsuarioConToken();
  }

  private loguearUsuarioConToken() {
    const token = getToken();
    if (token) {
      this.authService
        .loginWithToken(token)
        .pipe(take(1))
        .subscribe(
          (user: IdentifyTokenOActualizarUsuario) =>
            user?.meta?.status === 200
              ? this.crearYSetearUsuario(user?.data)
              : null,
          (err) => {
            Swal.fire(
              '¡Lo sentimos!',
              'Tuvimos un inconveniente a la hora de cargar tu información de usuario. Por favor intentá recargando la página',
              'error'
            );
          }
        );
    }
  }

  private crearYSetearUsuario(usuario: UserData) {
    const loggedUser: User = {
      id: usuario.id,
      nombre: usuario.first_name,
      apellido: usuario.last_name,
      email: usuario.email,
      role: usuario.role,
      dni: usuario.dni,
      avatar: usuario.avatar,
      phone: usuario.phone,
      projects: usuario.Projects,
    };
    loggedUser ? this.userStore.setUser(loggedUser) : null;
  }
}
