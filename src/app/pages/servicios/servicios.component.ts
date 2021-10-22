import { Component, OnInit } from '@angular/core';

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

  servicios: serviciosInt[] = [];
  breakpoint: number = 0;


  constructor() { }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 726) ? 1 : 2;

    this.servicios = [
      {
        foto: '../../../assets/servicios-1.jpg',
        nombre: 'Viviendas unifamiliares',
        ruta: ''
      },
      {
        foto: '.../../../assets/servicios-2.jpg',
        nombre: 'Sitios para antenas de telecomunicaciones',
        ruta: ''
      },
      {
        foto: '../../../assets/servicios-3.jpg',
        nombre: 'Piscinas',
        ruta: ''
      },
      {
        foto: '../../../assets/lote.jpg',
        nombre: 'Lotes',
        ruta: ''
      },
    ]

    this.servicios.forEach(servicio => {
      servicio.ruta = `/servicios/${servicio.nombre.toLowerCase().trim().replace(/\s/g,'')}`
    })
  }

  onResize(event: any) {
    this.breakpoint = (event?.target?.innerWidth <= 726) ? 1 : 2;
  }

}
