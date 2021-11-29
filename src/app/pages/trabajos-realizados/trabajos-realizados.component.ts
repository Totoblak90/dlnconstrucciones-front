import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { TypesOfJobs, TypesOfJobsData } from '../../interfaces/http/jobs.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss']
})
export class TrabajosRealizadosComponent implements OnInit, OnDestroy {

  public trabajosComplete!: TypesOfJobs;
  public trabajosData: TypesOfJobsData[] = [];
  public numberOfColumns: number = 0;
  public rowHeight: string = "";
  private destroy$: Subject<boolean> = new Subject();

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.numberOfColumns = (window.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (window.innerWidth <= 575) ? "2:1" : "90vh"
    this.httpService.getTypesOfJob()
      .pipe(takeUntil(this.destroy$))
      .subscribe((jobCategories: TypesOfJobs) => {
        this.trabajosComplete = jobCategories;
        this.trabajosData = jobCategories?.data;
        this.trabajosData?.forEach(trabajo => {
          trabajo.url = `/trabajos-realizados/${trabajo.id}`
        })
      })
  }

  onResize(event: any) {
    this.numberOfColumns = (event?.target?.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (event?.target?.innerWidth <= 575) ? "2:1" : "90vh"
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
