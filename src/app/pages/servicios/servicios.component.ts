import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ServicesData } from 'src/app/interfaces/http/services.interface';
import { HttpService } from '../../services/http.service';
import { Services } from '../../interfaces/http/services.interface';
import { environment } from 'src/environments/environment';
import { PresentationCard } from 'src/app/interfaces/presentation-card.interface';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit, OnDestroy {

  public servicios: ServicesData[] = [];
  public serviciosComplete!: Services;
  public servicesToPresent: PresentationCard[] = [];
  private destroy$: Subject<any> = new Subject();


  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.subscribeToServices();

  }

  private subscribeToServices(): void {
    this.httpService.getAllServices()
    .pipe(
      takeUntil(this.destroy$),
      map((servs: Services) => {
        this.serviciosComplete = servs
        return servs.data
      })
    )
    .subscribe( (servData: ServicesData[]) => {
      this.servicios = servData;
      this.servicios.forEach(servicio => {
        servicio.url = `/servicios/${servicio.id}`
        servicio.image = `${environment.API_IMAGE_URL}/${servicio.image}`
      })
      this.mapServicesToPresent();
    })
  }

  private mapServicesToPresent(): void {
    this.servicios.forEach( service => {
      this.servicesToPresent.push({
        titulo: service.title,
        urlFoto: service.image,
        ruta: service.url,
        sendDataByRoute: false
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
