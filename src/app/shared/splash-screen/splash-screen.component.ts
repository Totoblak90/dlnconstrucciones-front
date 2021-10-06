import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap'

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements AfterViewInit {

  @Output() animationEnded: EventEmitter<string> = new EventEmitter()

  constructor( private router: Router) { }


  ngAfterViewInit(): void {
    this.animateSplashScreen()
  }

  animateSplashScreen() {
    const tl = gsap.timeline()
    tl.from('img', {
      opacity: 0,
      duration: 2,
    }).from( 'mat-icon', {
      duration: 0.5,
      opacity: 0,
      y: -20,
      stagger: 0.2,
      delay: 0.5,
      repeat: 2,
    }).to('section', {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        this.animationEnded.emit('animación terminada')
      }
    })
  }


}
