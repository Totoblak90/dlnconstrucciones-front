import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { TypesOfJobs, TypesOfJobsData } from '../../interfaces/http/jobs.interface';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss']
})
export class TrabajosRealizadosComponent implements OnInit {

  public trabajosComplete!: TypesOfJobs;
  public trabajosData: TypesOfJobsData[] = [];
  public breakpoint: number = 0;
  public rowHeight: string = "";


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (window.innerWidth <= 575) ? "1:1" : "90vh"
    this.httpService.getTypesOfJob()
      .subscribe((jobCategories: TypesOfJobs) => {
        this.trabajosComplete = jobCategories;
        this.trabajosData = jobCategories?.data;
        this.trabajosData?.forEach(trabajo => {
          trabajo.url = `/trabajos-realizados/${trabajo.id}`
        })
      })
  }

  onResize(event: any) {
    this.breakpoint = (event?.target?.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (event?.target?.innerWidth <= 575) ? "1:1" : "90vh"
  }

}
