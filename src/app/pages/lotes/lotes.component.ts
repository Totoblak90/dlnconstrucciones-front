import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { PostalZonesData } from '../../interfaces/http/batches.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss'],
})
export class LotesComponent implements OnInit, OnDestroy {
  public postalZones!: PostalZonesData[];
  public numberOfColumns: number = 0;
  public rowHeight: string = '';
  private destroy$: Subject<boolean> = new Subject();

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.numberOfColumns = window.innerWidth <= 575 ? 1 : 2;
    this.rowHeight = window.innerWidth <= 575 ? '1:1' : '90vh';
    this.http
      .getAllZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (pz) => {
          this.postalZones = pz?.data;
          this.postalZones.forEach((postalZone) => {
            postalZone.url = `/lotes/${postalZone.id}`;
            postalZone.image = `${environment.API_IMAGE_URL}/${postalZone.image}`
          });
        },
        (err) => console.warn(err, 'Error en el pedido de las categorías')
      );
  }

  onResize(event: any) {
    this.numberOfColumns = event?.target?.innerWidth <= 575 ? 1 : 2;
    this.rowHeight = event?.target?.innerWidth <= 575 ? '1:1' : '90vh';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
