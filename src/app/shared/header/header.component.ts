import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap'
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('desktopNavbar') desktopNavbar!: ElementRef<HTMLUListElement>;
  public userIsLogged: boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  public get user(): User {
    return this.authService.getUser();
  }

  ngOnInit(): void {
    this.animations();
  }

  private animations(): void {
    const toAnimate = document.getElementsByClassName('animated-list')
    gsap.from(toAnimate ,{
      duration: 0.5,
      opacity: 0,
      stagger: 0.2,
      delay: 0.5,
      ease: 'fadeIn'
    })
  }

  public getUserImg() {
    return this.user?.getAvatar()
  }

  public openProfile(): void {
    if (this.userIsLogged) {
      this.router.navigateByUrl('/auth/profile')
    }
  }

}
