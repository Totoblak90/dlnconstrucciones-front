import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {
  unknownErrorAlert,
  customMessageAlertWithActions,
  noConnectionAlert,
} from '../../../../../helpers/alerts';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss'],
})
export class RecuperarContraseniaComponent implements OnDestroy {
  public forgotPasswordForm!: FormGroup;
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
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  public recuperarContrasenia() {
    this.forgotPasswordForm.markAllAsTouched();
    if (this.forgotPasswordForm.valid) {
      this.authService
        .restablecerContrasenia(this.forgotPasswordForm.value)
        .pipe()
        .subscribe({
          next: (res) => this.startForgotPasswordSecondStep(res),
          error: (err) => noConnectionAlert(err),
        });
    }
  }

  private startForgotPasswordSecondStep(res: any): void {
    if (res.meta.status.toString().includes('20')) {
      customMessageAlertWithActions(
        '¡Importante, leer!',
        'Te enviamos un correo electrónico a la casilla indicada, por favor apretá en el link que te enviamos y seguí los pasos. Si no lo ves en tu bandeja de entrada corroborá el spam. Tené cuidado, una vez hayas apretado el link se borrará tu contraseña actual. ¡No te olvides que el link se vence!',
        'OK',
        'warning'
      )
        .then(() =>
          this.router.navigateByUrl('/main/auth/recuperar-contrasenia-step2')
        )
        .catch((err) => unknownErrorAlert(err));
    } else {
      unknownErrorAlert();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
