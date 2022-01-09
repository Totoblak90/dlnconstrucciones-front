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
import { noConnectionAlert } from '../../../../../helpers/alerts';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnDestroy {
  public loginForm!: FormGroup;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
              : this.alertUsuarioInexistente();
          },
          (err) => noConnectionAlert(err)
        );
    }
  }

  private guardarOAlertarUsuarioLogueado(usuario: UserData): void {
    const loggedUser = new User(
      usuario.id,
      usuario.first_name,
      usuario.last_name,
      usuario.email,
      usuario.role,
      usuario.dni,
      usuario.avatar,
      usuario.phone,
      usuario.Projects
    );
    this.authService.setUser(loggedUser);
    this.router.navigateByUrl('/main/auth/profile');
  }

  private alertUsuarioInexistente(): void {
    Swal.fire({
      title: '¡Lo sentimos!',
      text: 'No tenemos un usuario registrado con ese email, podés registrart clickeando en el botón.',
      showDenyButton: true,
      confirmButtonText: 'Registrarse',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/main/auth/register');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
