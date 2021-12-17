import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostalZonesData } from '../../interfaces/http/batches.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PresentationCard } from '../../interfaces/presentation-card.interface';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss'],
})
export class LotesComponent implements OnInit, OnDestroy {
  private postalZones!: PostalZonesData[];
  public postalZonesToPresent: PresentationCard[] = [];
  private destroy$: Subject<boolean> = new Subject();

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.subscribeToPostalZones();
  }

  private subscribeToPostalZones(): void {
    this.http
      .getAllZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (pz) => {
          this.postalZones = pz?.data;
          this.postalZones?.forEach((postalZone) => {
            postalZone.url = `/main/lotes/${postalZone.id}`;
            postalZone.image = `${environment.API_IMAGE_URL}/${postalZone.image}`
          });
          this.mapPostalZonesToPresent();
        },
        (err) => console.warn(err, 'Error en el pedido de las categorías')
      );
  }

  private mapPostalZonesToPresent(): void {
    this.postalZones?.forEach( postalZone => {
      this.postalZonesToPresent.push({
        titulo: postalZone.title,
        urlFoto: postalZone.image,
        ruta: postalZone.url,
        sendDataByRoute: true,
        urlData: {data: postalZone.id},
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
