import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Batch,
  BatchComplete,
} from '../../../../interfaces/http/batches.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-detalle-lote',
  templateUrl: './detalle-lote.component.html',
  styleUrls: ['./detalle-lote.component.scss'],
})
export class DetalleLoteComponent implements OnInit, OnDestroy {
  public loteId: string = '';
  public lote!: Batch;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => (this.loteId = params.lote_id));
  }

  ngOnInit(): void {
    this.subscribeToDetallelote();
  }

  private subscribeToDetallelote(): void {
    this.http
      .getDetalleLote(this.loteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((lote: BatchComplete) => {
        this.lote = lote?.data;
        this.lote.image = `${environment.API_IMAGE_URL}/${this.lote.image}`;
      });
  }

  public navigateBack(): void {
    this.router.navigateByUrl('/main/lotes');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
