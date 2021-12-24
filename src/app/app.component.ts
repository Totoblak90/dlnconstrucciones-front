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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
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

  private crearYSetearUsuario(user: UserData) {
    const u: User = new User(
      user?.id,
      user?.first_name,
      user?.last_name,
      user?.email,
      user?.role,
      user?.dni,
      user?.avatar,
      user?.phone
    );

    u ? this.authService.setUser(u) : null;
  }
}
