import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ServicesData } from 'src/app/interfaces/http/services.interface';
import { HttpService } from '../../services/http.service';
import { Services } from '../../interfaces/http/services.interface';

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
export class ServiciosComponent implements OnInit, OnDestroy {

  public servicios: ServicesData[] = [];
  public serviciosComplete!: Services;
  public breakpoint: number = 0;
  public rowHeight: string = "";
  private destroy$: Subject<any> = new Subject();


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (window.innerWidth <= 575) ? "1:1" : "90vh"
    this.httpService.getAllServices()
      .pipe(
        takeUntil(this.destroy$),
        map((servs: Services) => {
          this.serviciosComplete = servs
          return servs.data
        })
      )
      .subscribe( servData => {
        this.servicios = servData;
        this.servicios.forEach(servicio => {
          servicio.url = `/servicios/${servicio.id}`
        })
      })
  }

  onResize(event: any) {
    this.breakpoint = (event?.target?.innerWidth <= 575) ? 1 : 2;
    this.rowHeight = (event?.target?.innerWidth <= 575) ? "1:1" : "90vh"
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
