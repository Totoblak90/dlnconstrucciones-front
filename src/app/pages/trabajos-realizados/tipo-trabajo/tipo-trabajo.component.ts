import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job, JobBaseData, JobMoreInfo } from 'src/app/interfaces/http/jobs.interface';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-tipo-trabajo',
  templateUrl: './tipo-trabajo.component.html',
  styleUrls: ['./tipo-trabajo.component.scss']
})
export class TipoTrabajoComponent implements OnInit, OnDestroy {
  public trabajoCompleto!: Job;
  public trabajoBaseInfo!: JobBaseData;
  public trabajoInfo!: JobMoreInfo[];
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idTipoTrabajo: string = this.activatedRoute.snapshot.params.idTipoTrabajo;
    this.httpService.getOneTypeOfJob(idTipoTrabajo)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((jobFull: Job) => {
        this.trabajoCompleto = jobFull;
        this.trabajoBaseInfo = jobFull.data;
        this.trabajoInfo = jobFull.data.Jobs;
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
