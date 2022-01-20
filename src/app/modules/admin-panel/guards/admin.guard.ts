import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserStoreService } from '../../../services/user-store.service';
import { Observable } from 'rxjs';
import { userRole } from '../../main/interfaces/http/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  private user: Observable<User>;
  private userRole!: userRole;

  constructor(private router: Router, private userStore: UserStoreService) {
    this.user = this.userStore.loggedUser$;
    this.user.subscribe((res) => {
      if (res.role) {
        this.userRole = res.role;
      }
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      localStorage.getItem('access-token') &&
      (this.userRole === 'admin' || this.userRole === 'master')
    ) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (
      localStorage.getItem('access-token') &&
      (this.userRole === 'admin' || this.userRole === 'master')
    ) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
}
