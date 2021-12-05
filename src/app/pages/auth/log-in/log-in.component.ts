import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Login, LoginForm } from '../../../interfaces/http/auth.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnDestroy {
  public loginForm!: FormGroup;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
        .subscribe((res: Login) => console.log(res));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
