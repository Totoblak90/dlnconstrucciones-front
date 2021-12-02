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

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.scss'],
})
export class TipoServicioComponent implements OnInit, OnDestroy {
  tipoServicioComplete!: TipoServicio;
  tipoServicio!: TipoServicioData;
  tipoServicioContents!: TipoServicioDataContent[];
  tipoServicioPictures!: TipoServicioDataPictures[];
  public numberOfColumns: number = 0;
  public rowHeight: string = '';
  public galleryId: string = 'mixedExample';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.numberOfColumns = window.innerWidth <= 575 ? 1 : 3;
    this.rowHeight = window.innerWidth <= 575 ? '2:1' : '50vh';

    const serviceId = this.activeRoute.snapshot.params.servicioId;
    this.httpService.getOneService(serviceId).subscribe((serv) => {
      this.tipoServicioComplete = serv;
      this.tipoServicio = serv?.data;
      this.tipoServicioContents = serv?.data?.Contents;
      this.tipoServicioPictures = serv?.data?.Pictures;

      this.tipoServicioPictures?.forEach((picture) => {
        picture.picture = `${environment.API_IMAGE_URL}/${picture.picture}`;
      });
    });
  }

  public onResize(event: any): void {
    this.numberOfColumns = event?.target?.innerWidth <= 575 ? 1 : 3;
    this.rowHeight = event?.target?.innerWidth <= 575 ? '2:1' : '50vh';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
