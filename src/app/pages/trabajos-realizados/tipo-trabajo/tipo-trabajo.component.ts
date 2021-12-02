import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Job,
  JobBaseData,
  JobMoreInfo,
} from 'src/app/interfaces/http/jobs.interface';
import { HttpService } from '../../../services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tipo-trabajo',
  templateUrl: './tipo-trabajo.component.html',
  styleUrls: ['./tipo-trabajo.component.scss'],
})
export class TipoTrabajoComponent implements OnInit, OnDestroy {
  public trabajoCompleto!: Job;
  public trabajoBaseInfo!: JobBaseData;
  public trabajoInfo!: JobMoreInfo[];
  public numberOfColumns: number = 0;
  public rowHeight: string = '';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.numberOfColumns = window.innerWidth <= 575 ? 1 : 3;
    this.rowHeight = window.innerWidth <= 575 ? '2:1' : '50vh';
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
