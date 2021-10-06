import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from "gsap";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('firstSection') firstSection!: ElementRef<HTMLDivElement>;

  constructor() { }

  ngAfterViewInit(): void {

  }


  ngOnInit(): void {

  }

}
