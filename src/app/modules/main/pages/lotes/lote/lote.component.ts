import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PresentationCard } from '../../../interfaces/presentation-card.interface';
import { Batch, Lotes } from '../../../interfaces/http/batches.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss'],
})
export class LoteComponent implements OnInit, OnDestroy {
  public lotesToPresent: PresentationCard[] = [];
  private localidadID: string = '';
  private lotes: Batch[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private router: Router, private httpService: HttpService) {
    this.getDataFromRoute();
  }

  ngOnInit(): void {
    this.subscribeToLotes();
  }

  private subscribeToLotes(): void {
    this.httpService
      .getLotes(this.localidadID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Lotes) => {
          this.lotes = res?.data?.Batches;
          this.lotes?.forEach((lote) => {
            lote.url = `/main/lotes/${lote.categories_id}/detalle/${lote.id}`;
            lote.image = `${environment.API_IMAGE_URL}/${lote.image}`;
          });
          this.mapLotesToPresent();
          this.checkLotesLength();
        },
        (err) => console.log(err)
      );
  }

  private checkLotesLength() {
    if (!this.lotes?.length) {
      this.router.navigateByUrl('/lotes');
    }
  }

  private getDataFromRoute(): void {
    this.localidadID = this.router.getCurrentNavigation()?.extras?.state?.data;
  }

  private mapLotesToPresent(): void {
    this.lotes?.forEach((lote) => {
      this.lotesToPresent.push({
        titulo: lote.title,
        urlFoto: lote.image,
        ruta: lote.url,
        descripcion: lote.description,
        sendDataByRoute: false,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
