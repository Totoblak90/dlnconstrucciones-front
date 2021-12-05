import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Batch, Lotes } from 'src/app/interfaces/http/batches.interface';
import { HttpService } from '../../../services/http.service';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss'],
})
export class LoteComponent implements OnInit, OnDestroy {
  private localidadID: string = '';
  public lotes: Batch[] = [];
  public numberOfColumns: number = 0;
  public rowHeight: string = '';
  private destroy$: Subject<boolean> = new Subject();

  constructor(private router: Router, private httpService: HttpService) {
    this.getDataFromRoute();
  }

  ngOnInit(): void {
    this.numberOfColumns = window.innerWidth <= 575 ? 1 : 3;
    this.rowHeight = window.innerWidth <= 575 ? '1:1' : '50vh';
    this.httpService
      .getLotes(this.localidadID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Lotes) => {
          this.lotes = res?.data?.Batches;
          this.lotes?.forEach((lote) => {
            lote.url = `/lotes/${lote.categories_id}/detalle/${lote.id}`;
            lote.image = `${environment.API_IMAGE_URL}/${lote.image}`;
          });
        },
        (err) => console.log(err)
      );
  }

  public onResize(event: any): void {
    this.numberOfColumns = event?.target?.innerWidth <= 575 ? 1 : 3;
    this.rowHeight = event?.target?.innerWidth <= 575 ? '1:1' : '50vh';
  }

  private getDataFromRoute(): void {
    this.localidadID = this.router.getCurrentNavigation()?.extras?.state?.data;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
