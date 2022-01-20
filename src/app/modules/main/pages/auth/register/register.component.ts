import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import {
  noConnectionAlert,
  unknownErrorAlert,
  customMessageAlertWithActions,
} from '../../../../../helpers/alerts';
import { RegisterRes } from '../../../interfaces/http/auth.interface';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserStoreService } from '../../../../../services/user-store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();
  public showValidationComponent: boolean = false;
  public passwordEye: string = 'fa fa-eye-slash';
  public userWantsToSeePassword: boolean = false;
  public repeatPasswordEye: string = 'fa fa-eye-slash';
  public userWantsToSeeRepeatPassword: boolean = false;
  public user: User | undefined;
  public registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) {
    this.setUser();
    this.createForm();
  }

  ngOnInit(): void {
    this.validateTermsAndConditionsAreRequired();
    this.validateRoleIsRequired();
  }

  private setUser(): void {
    this.userStore.loggedUser$.subscribe((res) => {
      res.id ? (this.user = res) : (this.user = undefined);
    });
  }

  private createForm(): void {
    this.registerForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.minLength(3)]],
        last_name: ['', [Validators.required, Validators.minLength(3)]],
        dni: [
          '',
          [
            Validators.required,
            Validators.max(999999999),
            Validators.min(1000000),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
        password: ['', Validators.required],
        passwordRepeat: ['', [Validators.required]],
        terminosYCondiciones: [false],
        role: ['user'],
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
      this.registerForm.controls.password.touched &&
      (this.registerForm.controls.password.errors?.notDigits ||
        this.registerForm.controls.password.errors?.noLowercase ||
        this.registerForm.controls.password.errors?.noUppercase ||
        this.registerForm.controls.password.errors?.notSymbols ||
        this.registerForm.controls.password.errors?.minlength)
    );
  }

  private validateTermsAndConditionsAreRequired(): void {
    const termsAndConditions: AbstractControl | undefined | null =
      this.registerForm.controls.terminosYCondiciones;

    if (
      (this.user && this.user?.role !== 'master' && termsAndConditions) ||
      !this.user
    ) {
      !this.registerForm.controls.terminosYCondiciones?.value
        ? this.registerForm.controls.terminosYCondiciones?.setErrors({
            required: true,
          })
        : null;
    }
  }

  private validateRoleIsRequired(): void {
    const role: AbstractControl = this.registerForm.controls.role;
    role?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (this.user?.role === 'master' && value === 'no') {
        role.setErrors({ notValue: true });
      }
    });
  }

  public register(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      if (this.user?.role === 'master') {
        this.authService
          .registerSiendoMaster(this.registerForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => this.setRegisterFlow(res),
            error: (err) => noConnectionAlert(err),
          });
      } else {
        this.authService
          .register(this.registerForm.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res: RegisterRes) => this.setRegisterFlow(res),
            (err) => noConnectionAlert(err)
          );
      }
    }
  }

  private setRegisterFlow(res: RegisterRes): void {
    if (res.meta.status.toString().includes('20')) {
      if (this.user?.role === 'master') {
        customMessageAlertWithActions(
          '¡Perfecto, CABALLO!',
          'Usuario creado',
          'OK',
          'success'
        ).then((result) =>
          result ? this.router.navigateByUrl('/admin/dashboard') : null
        );
      } else {
        this.showValidationComponent = true;
      }
    } else {
      unknownErrorAlert(res);
    }
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
