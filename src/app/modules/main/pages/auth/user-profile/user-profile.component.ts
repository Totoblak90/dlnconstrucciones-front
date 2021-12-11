import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  public editProfileForm: FormGroup = this.fb.group(    {
    first_name: [this.user?.nombre, [Validators.required, Validators.minLength(3)]],
    last_name: [this.user?.apellido, [Validators.required, Validators.minLength(3)]],
    dni: [
      this.user?.dni,
      [
        Validators.required,
        Validators.max(999999999),
        Validators.min(1000000),
      ],
    ],
    email: [this.user?.email, [Validators.required, Validators.pattern(this.emailPattern)]],
    phone: [this.user?.phone, [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        // Validators.pattern(this.passwordPattern)
      ],
    ],
    passwordRepeat: ['', [Validators.required]],
  },
  {
    validator: this.passwordMatchFormValidator('password', 'passwordRepeat'),
  })

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  public get user(): User {
    return this.authService.getUser();
  }

  public cambiarFoto(e: any): void {
    const file: File = e.target!.files[0];
    console.log(file)
  }

  public cambiarPerfil(): void {
    if (this.editProfileForm.valid) {
      console.log('Guardo el nuevo perfil!!')
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
}
