import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ProjectsService } from '../../../../admin-panel/services/projects.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import {
  unknownErrorAlert,
  noConnectionAlert,
} from '../../../../../helpers/alerts';
import {
  IdentifyTokenOActualizarUsuario,
  UserData,
} from '../../../interfaces/http/auth.interface';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/modules/admin-panel/interfaces/users.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  public editProfileForm!: FormGroup;
  public mostrarRepetirContrasena: boolean = false;
  public formatoImagenNoAceptado: boolean = false;
  public passwordEye: string = 'fa fa-eye-slash';
  public userWantsToSeePassword: boolean = false;
  public repeatPasswordEye: string = 'fa fa-eye-slash';
  public userWantsToSeeRepeatPassword: boolean = false;
  public user: User | undefined;
  public userAvatar: string | undefined;
  public userName: string | undefined;
  public userLastName: string | undefined;
  public userEmail: string | undefined;
  public userPhone: string | undefined;
  public userProjects: Project[] | undefined;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private renderer: Renderer2,
    private userStore: UserStoreService
  ) {
    this.setUserAndCreateForm();
  }

  private setUserAndCreateForm(): void {
    this.userStore.loggedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.id) {
          this.user = res;
          this.userAvatar = `${environment.API_IMAGE_URL}/users/${res.avatar}`;
          this.userName = res.nombre;
          this.userLastName = res.apellido;
          this.userEmail = res.email;
          this.userPhone = res.phone;
          this.userProjects = res.projects;
          this.createForm();
        } else {
          this.createForm();
        }
      });
  }

  private createForm(): void {
    this.editProfileForm = this.fb.group(
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
          this.passwordMatchFormValidator,
          this.validateStrongPassword,
        ],
      }
    );
  }

  private passwordMatchFormValidator(form: FormGroup): void {
    const pass1Control = form.get('password');
    const pass2Control = form.get('passwordRepeat');

    if (pass1Control!.value === pass2Control!.value) {
      pass2Control!.setErrors(null);
    } else {
      pass2Control!.setErrors({ notMatch: true });
    }
  }

  private validateStrongPassword(form: FormGroup): void {
    const password = form.get('password');
    if (password?.value) {
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

  public showPassword(e: HTMLInputElement): void {
    this.userWantsToSeePassword = !this.userWantsToSeePassword;
    this.userWantsToSeePassword
      ? (this.passwordEye = 'fa fa-eye')
      : (this.passwordEye = 'fa fa-eye-slash');
    this.userWantsToSeePassword ? (e.type = 'text') : (e.type = 'password');
  }

  public showRepeatPassword(e: HTMLInputElement): void {
    this.userWantsToSeeRepeatPassword = !this.userWantsToSeeRepeatPassword;
    this.userWantsToSeeRepeatPassword
      ? (this.repeatPasswordEye = 'fa fa-eye')
      : (this.repeatPasswordEye = 'fa fa-eye-slash');
    this.userWantsToSeeRepeatPassword
      ? (e.type = 'text')
      : (e.type = 'password');
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
    this.userStore.setUser(loggedUser);
    Swal.fire('¡Excelente!', 'Actualizamos tus datos sin problemas', 'success');
  }

  public toggleRepetirConstrasena(): void {
    this.editProfileForm.controls.password.value
      ? (this.mostrarRepetirContrasena = true)
      : (this.mostrarRepetirContrasena = false);
  }

  public descargarCashflow(cashflow: string): void {
    this.projectsService
      .getCashflow(cashflow)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Blob) => {
          const newBlob = new Blob([res], { type: res.type });

          const data = window.URL.createObjectURL(newBlob);
          const fileName = cashflow;
          let link = this.renderer.createElement('a');
          link.href = data;
          link.download = fileName;

          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );

          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
            this.renderer.destroy();
          }, 100);
        },
        (err) => noConnectionAlert(err)
      );
  }

  public logout(): void {
    this.userStore.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
