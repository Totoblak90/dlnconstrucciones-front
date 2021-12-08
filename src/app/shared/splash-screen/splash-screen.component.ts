import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {

  @Output() animationEnded: EventEmitter<string> = new EventEmitter()

  constructor( private router: Router) { }



}
