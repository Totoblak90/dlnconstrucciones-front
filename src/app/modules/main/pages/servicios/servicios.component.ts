import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Services,
  ServicesData,
} from '../../interfaces/http/services.interface';
import { environment } from 'src/environments/environment';
import { PresentationCard } from '../../interfaces/presentation-card.interface';
import { HttpService } from 'src/app/services/http.service';
import {
  unknownErrorAlert,
  noConnectionAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServiciosComponent implements OnInit, OnDestroy {
  public servicios: ServicesData[] = [];
  public serviciosComplete!: Services;
  public servicesToPresent: PresentationCard[] = [];
  private destroy$: Subject<any> = new Subject();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.subscribeToServices();
  }

  private subscribeToServices(): void {
    this.httpService
      .getAllServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (servicios: Services) => {
          if (servicios.meta.status.toString().includes('20')) {
            this.serviciosComplete = servicios;
            this.servicios = servicios.data;
            this.servicios.forEach((servicio) => {
              servicio.url = `/main/servicios/${servicio.id}`;
              servicio.image = `${environment.API_IMAGE_URL}/${servicio.image}`;
            });
            this.mapServicesToPresent();
          } else {
            unknownErrorAlert(servicios);
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private mapServicesToPresent(): void {
    this.servicios.forEach((service) => {
      this.servicesToPresent.push({
        titulo: service.title,
        urlFoto: service.image,
        ruta: service.url,
        sendDataByRoute: false,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
