import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoServicio } from 'src/app/interfaces/http/services.interface';
import { HttpService } from 'src/app/services/http.service';
import { TipoServicioData, TipoServicioDataContent, TipoServicioDataPictures } from '../../../interfaces/http/services.interface';
import { Gallery, GalleryRef } from 'ng-gallery';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.scss']
})
export class TipoServicioComponent implements OnInit, OnDestroy {

  tipoServicioComplete!: TipoServicio;
  tipoServicio!: TipoServicioData;
  tipoServicioContents!: TipoServicioDataContent[];
  tipoServicioPictures!: TipoServicioDataPictures[];
  public  galleryId:string = 'mixedExample';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activeRoute: ActivatedRoute,
    private gallery: Gallery
  ) { }

  ngOnInit(): void {
    const serviceId = this.activeRoute.snapshot.params.servicioId;
    this.httpService.getOneService(serviceId)
      .subscribe(serv => {
        this.tipoServicioComplete = serv;
        this.tipoServicio = serv?.data;
        this.tipoServicioContents = serv?.data?.Contents;
        this.tipoServicioPictures = serv?.data?.Pictures;

        this.tipoServicioPictures?.forEach(picture => {
          const galleryRef: GalleryRef = this.gallery.ref(this.galleryId , {
            autoPlay: true,
            loop: true,
            counter: true,
            counterPosition: 'top',
            dots: true,
            dotsPosition: 'bottom',
            dotsSize: 16,
            gestures: true,
            imageSize: 'contain',
            loadingStrategy: 'lazy',
            nav: true,
            panSensitivity: 1,
            playerInterval: 1,
            slidingDirection: 'horizontal',
            thumbMode: 'free',
            thumbPosition: 'bottom',
          });
          galleryRef.addImage({
            src: '../../../assets/servicios-1.jpg',
            thumb: '../../../assets/servicios-1.jpg'
            // src: picture.picture,
            // thumb: picture.picture,
          });
        })
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
