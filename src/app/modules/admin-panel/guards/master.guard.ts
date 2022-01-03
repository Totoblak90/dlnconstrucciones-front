import { Injectable } from '@angular/core';
import { AuthService } from '../../main/services/auth.service';
import { Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MasterGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      localStorage.getItem('access-token') &&
      this.authService.getUser().role !== 'master'
    ) {
      this.router.navigateByUrl('admin/');
      return false;
    }
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (
      localStorage.getItem('access-token') &&
      this.authService.getUser().role !== 'master'
    ) {
      this.router.navigateByUrl('admin/');
      return false;
    }
    return true;
  }
}
