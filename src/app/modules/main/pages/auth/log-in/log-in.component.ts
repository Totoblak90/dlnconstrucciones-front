import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {
  LoginRes,
  LoginForm,
  UserData,
} from '../../../interfaces/http/auth.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from '../../../../../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  noConnectionAlert,
  customMessageAlert,
} from '../../../../../helpers/alerts';
import { UserStoreService } from '../../../../../services/user-store.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnDestroy {
  public loginForm!: FormGroup;
  public passwordEye: string = 'fa fa-eye-slash';
  public userWantsToSeePassword: boolean = false;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  public login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value as LoginForm)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: LoginRes) => {
            res?.data?.token
              ? localStorage.setItem('access-token', res?.data?.token)
              : null;
            res?.meta?.status === 200
              ? this.guardarOAlertarUsuarioLogueado(res?.data?.user)
              : customMessageAlert(
                  '??Lo sentimos!',
                  'Credenciales incorrectas. Por favor valid?? la informaci??n ingresada.',
                  'OK',
                  'error'
                );
          },
          (err) => noConnectionAlert(err)
        );
    }
  }

  private guardarOAlertarUsuarioLogueado(usuario: UserData): void {
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
    this.router.navigateByUrl('/main/auth/profile');
  }

  public showPassword(e: HTMLInputElement): void {
    this.userWantsToSeePassword = !this.userWantsToSeePassword;
    this.userWantsToSeePassword
      ? (this.passwordEye = 'fa fa-eye')
      : (this.passwordEye = 'fa fa-eye-slash');
    this.userWantsToSeePassword ? (e.type = 'text') : (e.type = 'password');
  }

  public recuperarContrasenia(): void {
    this.router.navigateByUrl('/main/auth/recuperar-contrasenia');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
