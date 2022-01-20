import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private _user: User = {
    apellido: '',
    email: '',
    id: 0,
    nombre: '',
    role: 'user',
  };
  private loggedUser: BehaviorSubject<User> = new BehaviorSubject(this._user);
  public loggedUser$ = this.loggedUser.asObservable();

  constructor(private router: Router) {}

  public setUser(user: User): void {
    this.loggedUser.next(user);
  }

  public logout(): void {
    this.loggedUser.next({
      apellido: '',
      email: '',
      id: 0,
      nombre: '',
      role: 'user'
    })
    localStorage.removeItem('access-token')
    this.router.navigateByUrl('/')
  }
}
