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
import { AuthService } from '../../main/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  user: User = this.authService.getUser();

  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      localStorage.getItem('access-token') &&
      (this.user?.role === 'admin' || this.user?.role === 'master')
    ) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    console.log(this.user)
    if (
      localStorage.getItem('access-token') &&
      (this.user?.role === 'admin' || this.user?.role === 'master')
    ) {
      return true;
    }
    this.router.navigate(['main', 'home']);
    return false;
  }
}
