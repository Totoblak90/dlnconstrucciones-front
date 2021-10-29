import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job, JobBaseData, JobMoreInfo } from 'src/app/interfaces/http/jobs.interface';
import { HttpService } from '../../../services/http.service';
import { Gallery, GalleryRef } from 'ng-gallery';

@Component({
  selector: 'app-tipo-trabajo',
  templateUrl: './tipo-trabajo.component.html',
  styleUrls: ['./tipo-trabajo.component.scss']
})
export class TipoTrabajoComponent implements OnInit, OnDestroy {
  public trabajoCompleto!: Job;
  public trabajoBaseInfo!: JobBaseData;
  public trabajoInfo!: JobMoreInfo[];
  public  galleryId:string = 'mixedExample';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private gallery: Gallery
  ) { }

  ngOnInit(): void {
    const idTipoTrabajo: string = this.activatedRoute.snapshot.params.idTipoTrabajo;
    this.httpService.getOneTypeOfJob(idTipoTrabajo)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((jobFull: Job) => {
        this.trabajoCompleto = jobFull;
        this.trabajoBaseInfo = jobFull?.data;
        this.trabajoInfo = jobFull?.data?.Jobs;
        this.trabajoInfo?.forEach((trabajo: JobMoreInfo) => {
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
            src: trabajo.image,
            thumb: trabajo.image,
            title: trabajo.title,
            description: trabajo.description
          });
        })
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
