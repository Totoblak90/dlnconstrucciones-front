import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginRes, LoginForm } from '../../../interfaces/http/auth.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { getToken } from '../../../helpers/functions.helper';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnDestroy {
  public loginForm!: FormGroup;
  private user!: User;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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
            localStorage.setItem('token', res.data.token);
            const loggedUser = new User(
              res?.data?.user?.first_name,
              res?.data?.user?.last_name,
              res?.data?.user?.email,
              res?.data?.user?.role,
              res?.data?.user?.avatar,
              res?.data?.user?.phone,
            )
            this.authService.setUser(loggedUser);
            this.router.navigateByUrl('/auth/profile')
          },
          (err) => console.log(err)
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
