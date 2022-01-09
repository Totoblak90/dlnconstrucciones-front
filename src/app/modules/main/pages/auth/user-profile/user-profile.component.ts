import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  unknownErrorAlert,
  noConnectionAlert,
} from '../../../../../helpers/alerts';
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
      password: [''],
      passwordRepeat: ['', [Validators.required]],
    },
    {
      validator: [
        this.passwordMatchFormValidator('password', 'passwordRepeat'),
        this.validateStrongPassword,
      ],
    }
  );
  public mostrarRepetirContrasena: boolean = false;
  public formatoImagenNoAceptado: boolean = false;
  private destroy$: Subject<boolean> = new Subject();

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  private validateStrongPassword(form: FormGroup): void {
    const password = form.get('password');
    if (!/\d/.test(password?.value)) {
      password?.setErrors({ notDigits: true });
    } else if (!/[a-z]/.test(password?.value)) {
      password?.setErrors({ noLowercase: true });
    } else if (!/[A-Z]/.test(password?.value)) {
      password?.setErrors({ noUppercase: true });
    } else if (!/[*._%+-]/.test(password?.value)) {
      password?.setErrors({ notSymbols: true });
    } else if (password?.value.length < 8) {
      password?.setErrors({ minlength: true });
    }
  }

  public showStrongPasswordErrorMsgs(): boolean {
    return (
      this.editProfileForm.controls.password.touched &&
      (this.editProfileForm.controls.password.errors?.notDigits ||
        this.editProfileForm.controls.password.errors?.noLowercase ||
        this.editProfileForm.controls.password.errors?.noUppercase ||
        this.editProfileForm.controls.password.errors?.notSymbols ||
        this.editProfileForm.controls.password.errors?.minlength)
    );
  }

  public get user(): User {
    return this.authService.getUser();
  }

  public cambiarFoto(e: any): void {
    const file: File = e.target.files[0];
    const formData: FormData = new FormData();
    formData.append('avatar', file);
    if (formData.get('avatar')) {
      switch (file?.type) {
        case 'image/jpg':
        case 'image/png':
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
          if (user.meta.status.toString().includes('20')) {
            this.modifyLoggedUser(user?.data);
          } else {
            unknownErrorAlert(user);
          }
        },
        (err) => noConnectionAlert(err)
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
          if (res?.meta?.status.toString().includes('20')) {
            this.modifyLoggedUser(res?.data);
          } else {
            unknownErrorAlert(res);
          }
        },
        (err) => noConnectionAlert(err)
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
      .catch((err) => noConnectionAlert(err));
  }

  private modifyLoggedUser(usuario: UserData) {
    const user: User = new User(
      usuario?.id,
      usuario?.first_name,
      usuario?.last_name,
      usuario?.email,
      usuario?.role,
      usuario?.dni,
      usuario?.avatar,
      usuario?.phone,
      usuario?.Projects
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
