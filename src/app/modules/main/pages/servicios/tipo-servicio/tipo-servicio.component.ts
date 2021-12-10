import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TipoServicio,
  TipoServicioData,
  TipoServicioDataContent,
  TipoServicioDataPictures,
} from '../../../interfaces/http/services.interface';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresentationCard } from '../../../interfaces/presentation-card.interface';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.scss'],
})
export class TipoServicioComponent implements OnInit, OnDestroy {
  public picturesToPresent: PresentationCard[] = [];
  public tipoServicio!: TipoServicioData;
  public tipoServicioContents!: TipoServicioDataContent[];
  public tipoServicioPictures!: TipoServicioDataPictures[];
  private tipoServicioComplete!: TipoServicio;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    const serviceId = this.activeRoute.snapshot.params.servicioId;
    this.httpService.getOneService(serviceId).subscribe((serv) => {
      this.tipoServicioComplete = serv;
      this.tipoServicio = serv?.data;
      this.tipoServicioContents = serv?.data?.Contents;
      this.tipoServicioPictures = serv?.data?.Pictures;

      this.tipoServicioPictures?.forEach((picture) => {
        picture.picture = `${environment.API_IMAGE_URL}/${picture.picture}`;
      });

      this.mapServicesToPresent();
    });
  }

  private mapServicesToPresent(): void {
    this.tipoServicioPictures?.forEach( picture => {
      this.picturesToPresent.push({
        urlFoto: picture.picture,
        openModal: true
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
