import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { noConnectionAlert } from 'src/app/helpers/alerts';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';
import {
  RestablecerContraseniaExitoso,
  UserData,
} from '../../../interfaces/http/auth.interface';
import { AuthService } from '../../../services/auth.service';
import { unknownErrorAlert } from '../../../../../helpers/alerts';
import { FullUser } from '../../../../admin-panel/interfaces/users.interface';

@Component({
  selector: 'app-recuperar-contrasenia-paso-dos',
  templateUrl: './recuperar-contrasenia-paso-dos.component.html',
  styleUrls: ['./recuperar-contrasenia-paso-dos.component.scss'],
})
export class RecuperarContraseniaPasoDosComponent {
  public nuevaContraseniaForm!: FormGroup;
  public passwordEye: string = 'fa fa-eye-slash';
  public userWantsToSeePassword: boolean = false;
  public repeatPasswordEye: string = 'fa fa-eye-slash';
  public userWantsToSeeRepeatPassword: boolean = false;
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
    this.nuevaContraseniaForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
        password: ['', [Validators.required]],
        passwordRepeat: ['', Validators.required],
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
      this.nuevaContraseniaForm.controls.password.touched &&
      (this.nuevaContraseniaForm.controls.password.errors?.notDigits ||
        this.nuevaContraseniaForm.controls.password.errors?.noLowercase ||
        this.nuevaContraseniaForm.controls.password.errors?.noUppercase ||
        this.nuevaContraseniaForm.controls.password.errors?.notSymbols ||
        this.nuevaContraseniaForm.controls.password.errors?.minlength)
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

  public guardarNuevaContrasenia(): void {
    this.nuevaContraseniaForm.markAllAsTouched();
    if (this.nuevaContraseniaForm.valid) {
      this.authService
        .guardarNuevaContrasenia(this.nuevaContraseniaForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: RestablecerContraseniaExitoso) => {
            res?.data?.token
              ? localStorage.setItem('access-token', res?.data?.token)
              : null;
            res?.meta?.status === 200
              ? this.guardarOAlertarUsuarioLogueado(res?.data?.user)
              : unknownErrorAlert();
          },
          error: (err) => noConnectionAlert(err),
        });
    }
  }

  private guardarOAlertarUsuarioLogueado(usuario: FullUser): void {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
