import { DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.firstSection = document.getElementsByClassName('first-section')
    this.secondSection = document.getElementsByClassName('second-section')
    this.thirdSection = document.getElementsByClassName('third-section')
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
    const tl = gsap.timeline();
    tl
    .from(this.secondSection, {
      scrollTrigger: {
        trigger: this.secondSection,
        scrub: 1,
        start: "center bottom"
      },
      opacity: 0,
    })
    .from(this.thirdSection, {
      scrollTrigger: {
        trigger: this.thirdSection,
        scrub: 1,
        start: "center bottom"
      },
      opacity: 0,
    })
  }

}
