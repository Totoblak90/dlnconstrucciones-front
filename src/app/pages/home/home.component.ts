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
  secondSection!: HTMLCollectionOf<Element>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.secondSection = document.getElementsByClassName('second-section')
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
    gsap.from(this.secondSection, {
      scrollTrigger: {
        trigger: this.secondSection,
        start: "top center",
      } as ScrollTrigger.Vars,
      xPercent: -100,
      opacity: 0,
      ease: 'bounce',
      duration: 1
    })
  }

}
