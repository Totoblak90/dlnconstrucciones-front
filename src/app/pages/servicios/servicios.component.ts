import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ServicesData } from 'src/app/interfaces/http/services.interface';
import { HttpService } from '../../services/http.service';

interface serviciosInt {
  foto: string;
  nombre: string;
  ruta: string;
}

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {

  servicios: ServicesData[] = [];
  breakpoint: number = 0;
  rowHeight: string = "";


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (window.innerWidth <= 575) ? "1:1" : "90vh"
    this.servicios = [
      {
        image: '/assets/servicios-1.jpg',
        title: 'Viviendas unifamiliares',
        url: ''
      },
      {
        image: '/assets/servicios-2.jpg',
        title: 'Sitios para antenas de telecomunicaciones',
        url: ''
      },
      {
        image: '/assets/servicios-3.jpg',
        title: 'Piscinas',
        url: ''
      },
      {
        image: '/assets/lote.jpg',
        title: 'Lotes',
        url: ''
      },
    ]

    this.servicios.forEach(servicio => {
      servicio.url = `/servicios/${servicio.title.toLowerCase().trim().replace(/\s/g,'')}`
    })

  }

  onResize(event: any) {
    this.breakpoint = (event?.target?.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (event?.target?.innerWidth <= 575) ? "1:1" : "90vh"
  }

}
