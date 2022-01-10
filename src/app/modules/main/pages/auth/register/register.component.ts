import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import {
  noConnectionAlert,
  customMessageAlert,
} from '../../../../../helpers/alerts';
import { RegisterRes } from '../../../interfaces/http/auth.interface';
import { unknownErrorAlert } from '../../../../../helpers/alerts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();
  public showValidationComponent: boolean = false;
  public passwordEye: string = 'fa fa-eye-slash';
  public repeatPasswordEye: string = 'fa fa-eye-slash';
  public userWantsToSeePassword: boolean = false;
  public userWantsToSeeRepeatPassword: boolean = false;
  public registerForm: FormGroup = this.fb.group(
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
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]],
      terminosYCondiciones: [false, [Validators.requiredTrue]],
    },
    {
      validator: [this.passwordMatchFormValidator, this.validateStrongPassword],
    }
  );

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  register(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: RegisterRes) => this.setRegisterFlow(res),
          (err) => unknownErrorAlert(err)
        );
    }
  }

  private setRegisterFlow(res: RegisterRes): void {
    if (res.meta.status === 401) {
      customMessageAlert(
        'Error',
        'El email introducido ya se encuentra registrado',
        'OK',
        'error'
      );
    } else if (res.meta.status.toString().includes('20')) {
      this.showValidationComponent = true;
    } else {
      unknownErrorAlert(res);
    }
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
