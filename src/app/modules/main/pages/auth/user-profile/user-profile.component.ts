import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  IdentifyTokenOActualizarUsuario,
  UserData,
} from '../../../interfaces/http/auth.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public editProfileForm: FormGroup = this.fb.group(
    {
      first_name: [
        this.user?.nombre,
        [Validators.required, Validators.minLength(3)],
      ],
      last_name: [
        this.user?.apellido,
        [Validators.required, Validators.minLength(3)],
      ],
      dni: [
        this.user?.dni,
        [
          Validators.required,
          Validators.max(999999999),
          Validators.min(1000000),
        ],
      ],
      email: [
        this.user?.email,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      phone: [this.user?.phone],
      password: [
        '',
        [
          /** Validators.pattern(this.passwordPattern)*/
        ],
      ],
      passwordRepeat: ['', [Validators.required]],
    },
    {
      validator: this.passwordMatchFormValidator('password', 'passwordRepeat'),
    }
  );
  public mostrarRepetirContrasena: boolean = false;
  public formatoImagenNoAceptado: boolean = false;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  public get user(): User {
    return this.authService.getUser();
  }

  public cambiarFoto(e: any): void {
    const file: File = e.target.files[0];
    const formData: FormData = new FormData();
    formData.append('avatar', file)
    if (formData.get('avatar')) {
      switch (file.type) {
        case 'image/jpg':
          this.formatoImagenNoAceptado = false;
          this.actualizarImagenEnDB(formData);
          return;
        case 'image/png':
          this.formatoImagenNoAceptado = false;
          this.actualizarImagenEnDB(formData);
          return;
        case 'image/jpeg':
          this.formatoImagenNoAceptado = false;
          this.actualizarImagenEnDB(formData);
          return;
        default:
          this.formatoImagenNoAceptado = true;
          break;
    }
    }
  }

  private actualizarImagenEnDB(formData: FormData): void {
    this.authService
      .actualizarImagenUsuario(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: IdentifyTokenOActualizarUsuario) => {
          console.log(user)
          if (user.meta.status === 200) {
            this.modifyLoggedUser(user?.data);
          } else {
            Swal.fire(
              '¡Lo sentimos!',
              'No podemos actualizar tu información por favor ponete en contacto con el administrador de la página',
              'error'
            );
          }
        },
        (err) => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos actualizar tu perfil como queríamos, por favor intentalo nuevamente',
            'error'
          );
        }
      );
  }

  public cambiarPerfil(): void {
    this.editProfileForm.markAllAsTouched();
    if (this.editProfileForm.valid) {
      this.editProfileForm.controls.password.value
        ? this.confirmAndModifyLoggedUser()
        : this.guardarCambiosEnBaseDeDatos();
    }
  }

  private guardarCambiosEnBaseDeDatos() {
    this.authService
      .actualizarUsuario(this.editProfileForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: IdentifyTokenOActualizarUsuario) => {
          if (res?.meta?.status === 200) {
            this.modifyLoggedUser(res?.data);
          } else {
            Swal.fire(
              '¡Lo sentimos!',
              'No podemos actualizar tu información por favor ponete en contacto con el administrador de la página',
              'warning'
            );
          }
        },
        () => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos actualizar tu perfil como queríamos, por favor intentalo nuevamente',
            'error'
          );
        }
      );
  }

  private confirmAndModifyLoggedUser() {
    Swal.fire({
      title: '¿Estás seguro que querés cambiar tu contraseña?',
      showDenyButton: true,
      confirmButtonText: 'Si, continuar',
      denyButtonText: `No`,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.guardarCambiosEnBaseDeDatos();
        }
      })
      .catch((err) =>
        Swal.fire(
          '¡Lo sentimos!',
          'No pudimos actualizar tu perfil como queríamos, por favor intentalo nuevamente',
          'error'
        )
      );
  }

  private modifyLoggedUser(usuario: UserData) {
    const user: User = new User(
      usuario?.first_name,
      usuario?.last_name,
      usuario?.email,
      usuario?.role,
      usuario?.dni,
      usuario?.avatar,
      usuario?.phone
    );
    this.authService.setUser(user);
    Swal.fire('¡Excelente!', 'Actualizamos tus datos sin problemas', 'success');
  }

  public toggleRepetirConstrasena(): void {
    this.editProfileForm.controls.password.value
      ? (this.mostrarRepetirContrasena = true)
      : (this.mostrarRepetirContrasena = false);
  }

  private passwordMatchFormValidator(
    pass1: string,
    pass2: string
  ): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control!.value === pass2Control!.value) {
        pass2Control!.setErrors(null);
      } else {
        pass2Control!.setErrors({ notMatch: true });
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
