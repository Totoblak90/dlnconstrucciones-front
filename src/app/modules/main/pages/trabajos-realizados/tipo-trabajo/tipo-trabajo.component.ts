import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { Job, JobBaseData, JobMoreInfo } from '../../../interfaces/http/jobs.interface';
import { PresentationCard } from '../../../interfaces/presentation-card.interface';

@Component({
  selector: 'app-tipo-trabajo',
  templateUrl: './tipo-trabajo.component.html',
  styleUrls: ['./tipo-trabajo.component.scss'],
})
export class TipoTrabajoComponent implements OnInit, OnDestroy {
  public trabajoCompleto!: Job;
  public trabajoBaseInfo!: JobBaseData;
  public trabajoInfo!: JobMoreInfo[];
  public tipoTrabajoToPresent: PresentationCard[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idTipoTrabajo: string =
      this.activatedRoute.snapshot.params.idTipoTrabajo;
    this.httpService
      .getOneTypeOfJob(idTipoTrabajo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((jobFull: Job) => {
        this.trabajoCompleto = jobFull;
        this.trabajoBaseInfo = jobFull?.data;
        this.trabajoInfo = jobFull?.data?.Jobs;
        this.trabajoInfo?.forEach((trabajo: JobMoreInfo) => {
          trabajo.image = `${environment.API_IMAGE_URL}/${trabajo.image}`;
        });
        this.mapTrabajosToPresent();
      });
  }

  private mapTrabajosToPresent(): void {
    this.trabajoInfo.forEach( trabajo => {
      this.tipoTrabajoToPresent.push({
        titulo: trabajo.title,
        urlFoto: trabajo.image,
        openModal: true
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
