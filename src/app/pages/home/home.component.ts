import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


import { ModalComponent } from './modal/modal.component';
import { HttpService } from '../../services/http.service';
import { Interests, InterestsData } from '../../interfaces/http/interests.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public interestsComplete!: Interests;
  public interestsData: InterestsData[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private dialog: MatDialog,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.http.getInterests()
    .pipe(takeUntil(this.destroy$))
      .subscribe(interestsFull => {
        this.interestsComplete = interestsFull;
        this.interestsData = interestsFull.data;
      })
  }

  openDialog(index: number): void {
    this.dialog.open(
      ModalComponent,
      {
        data: this.interestsData[index]
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
