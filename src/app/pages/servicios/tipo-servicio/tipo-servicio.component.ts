import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoServicio } from 'src/app/interfaces/http/services.interface';
import { HttpService } from 'src/app/services/http.service';
import {
  TipoServicioData,
  TipoServicioDataContent,
  TipoServicioDataPictures,
} from '../../../interfaces/http/services.interface';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresentationCard } from 'src/app/interfaces/presentation-card.interface';

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
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
