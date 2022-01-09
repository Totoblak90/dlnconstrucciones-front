import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { noConnectionAlert } from '../../../../../helpers/alerts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

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
      terminosYCondiciones: [false, [Validators.required]],
    },
    {
      validator: [
        this.passwordMatchFormValidator('password', 'passwordRepeat'),
        this.validateStrongPassword,
      ],
    }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => this.router.navigateByUrl('/main/auth/login'),
          (err) => noConnectionAlert(err)
        );
    }
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
