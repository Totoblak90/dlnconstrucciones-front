import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { ModalComponent } from './modal/modal.component';
import { HttpService } from '../../services/http.service';
import { Interests, InterestsData } from '../../interfaces/http/interests.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public interestsComplete!: Interests;
  public interestsData: InterestsData[] = [];

  constructor(
    private dialog: MatDialog,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.http.getInterests()
      .subscribe(interestsFull => {
        this.interestsComplete = interestsFull;
        this.interestsData = interestsFull.data;
      })
  }

  openDialog(index: number): void {
    const dialogRef = this.dialog.open(
      ModalComponent,
      {
        // width: this.setModalWitdh(),
        data: this.interestsData[index]
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  setModalWitdh(): string {
    if (window.innerWidth <= 575) {
      return '100%'
    } else {
      return '50%'
    }
  }

}
