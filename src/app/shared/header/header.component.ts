import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap'
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('desktopNavbar') desktopNavbar!: ElementRef<HTMLUListElement>;

  constructor() { }

  ngOnInit(): void {
    this.animations();
  }

  animations() {
    const toAnimate = document.getElementsByClassName('animated-list')
    gsap.from(toAnimate ,{
      duration: 0.5,
      opacity: 0,
      stagger: 0.2,
      delay: 0.5,
      ease: 'fadeIn'
    })
  }

}
