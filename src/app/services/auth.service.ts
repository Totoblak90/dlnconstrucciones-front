import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { setUserProp, userRole } from '../interfaces/http/auth.interface';
import {
  LoginRes,
  LoginForm,
  RegisterForm,
  RegisterRes,
} from '../interfaces/http/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedUser!: User;
  constructor(private httpClient: HttpClient) {}

  public login(payload: LoginForm): Observable<LoginRes> {
    return this.httpClient.post<LoginRes>(
      `${environment.API_BASE_URL}/users/login`,
      payload
    );
  }

  public register(payload: RegisterForm): Observable<RegisterRes> {
    return this.httpClient.post<RegisterRes>(
      `${environment.API_BASE_URL}/users/register`,
      payload
    );
  }

  public getUser(): User {
    return this.loggedUser;
  }

  public setUser(user: User): void {
    this.loggedUser = user;
  }
}
