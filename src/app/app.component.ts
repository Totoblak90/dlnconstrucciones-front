import { Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap/all';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('splashScreen') splashScreenContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLDivElement>;

  constructor () {}

  endAnimation(e: string) {
    this.splashScreenContainer.nativeElement.style.display = 'none'
    this.mainContainer.nativeElement.style.display = 'block'
    this.showMainScreen();
  }

  showMainScreen() {
    gsap.from('#main', {
      x: 100,
      opacity: 0,
      duration: 2
    })
  }

}
