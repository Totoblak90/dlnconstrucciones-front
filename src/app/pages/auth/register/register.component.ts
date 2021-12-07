import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private passwordPattern: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-zd$@$!%*?&#.$($)$-$_]{8,}$';
  private destroy$: Subject<boolean> = new Subject();

  public registerForm: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [
        '',
        [
          Validators.required,
          // Validators.pattern(this.passwordPattern)
        ],
      ],
      passwordRepeat: [''],
      terminosYCondiciones: [false, [Validators.required]],
    },
    {
      validator: this.passwordMatchFormValidator('password', 'passwordRepeat'),
    }
  );
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  register(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value)
        .subscribe((res) => console.log(res));
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
