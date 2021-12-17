import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../../../models/user.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public get user(): User {
    return this.authService.getUser();
  }

  constructor(private authService: AuthService) {}
}
