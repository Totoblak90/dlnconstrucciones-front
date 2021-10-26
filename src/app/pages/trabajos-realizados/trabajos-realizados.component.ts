import { Component, OnInit } from '@angular/core';
import { Jobs, JobsData } from 'src/app/interfaces/http/jobs.interface';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-trabajos-realizados',
  templateUrl: './trabajos-realizados.component.html',
  styleUrls: ['./trabajos-realizados.component.scss']
})
export class TrabajosRealizadosComponent implements OnInit {

  trabajosComplete!: Jobs;
  trabajosData: JobsData[] = [];
  breakpoint: number = 0;
  rowHeight: string = "";


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (window.innerWidth <= 575) ? "1:1" : "90vh"
    this.trabajosData = [
      {
        image: '/assets/quienes-somos-3.jpg',
        title: 'Construcción',
        url: ''
      },
      {
        image: '/assets/servicios-2.jpg',
        title: 'Antenas de telecomunicaciones',
        url: ''
      }
    ]

    this.trabajosData.forEach(trabajo => {
      trabajo.url = `/trabajos-realizados/${trabajo.title.toLowerCase().trim().replace(/\s/g,'')}`
    })

  }

  onResize(event: any) {
    this.breakpoint = (event?.target?.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (event?.target?.innerWidth <= 575) ? "1:1" : "90vh"
  }

}
