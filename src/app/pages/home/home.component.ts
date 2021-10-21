import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { ModalComponent } from './modal/modal.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  firstSection!: HTMLCollectionOf<Element>;
  secondSection!: HTMLCollectionOf<Element>;
  thirdSection!: HTMLCollectionOf<Element>;
  sectionFour!: HTMLCollectionOf<Element>;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.firstSection = document.getElementsByClassName('first-section')
    this.secondSection = document.getElementsByClassName('second-section')
    this.thirdSection = document.getElementsByClassName('third-section')
    this.sectionFour = document.getElementsByClassName('section-four')
  }

  ngAfterViewInit(): void {
    this.animations();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(
      ModalComponent,
      {
        width: '50%',
        data: null
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  animations(): void {
    const tl = gsap.timeline()
    tl.
    from(this.firstSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.5,
    })
    .from(this.secondSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.5

    })
    .from(this.thirdSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
    })
    .from(this.sectionFour, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.2
    })
  }

}
