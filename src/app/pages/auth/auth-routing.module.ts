import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileGuard } from 'src/app/guards/profile.guard';
import { LogInComponent } from './log-in/log-in.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./log-in/log-in.module').then(m => m.LogInModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'profile',
    canActivate: [ProfileGuard],
    canLoad: [ProfileGuard],
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
