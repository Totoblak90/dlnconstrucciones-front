import { DOCUMENT } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { gsap } from 'gsap'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('navigationMenu') navMenu!: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit(): void {
    this.initNavBarAnimations();
  }

  initNavBarAnimations() {
    const buttons = document.getElementsByClassName('buttons');
    gsap.from(buttons, {
      duration: 0.5,
      opacity: 0,
      y: -1,
      stagger: 0.2,
      delay: 0.5
    })
  }


}
