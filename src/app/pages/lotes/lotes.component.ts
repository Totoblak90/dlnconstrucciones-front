import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { PostalZones } from '../../interfaces/http/batches.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit {

  public postalZones!: PostalZones;
  public src: string = `../../../../server/public/assets/`
  public numberOfColumns: number = 0;
  public rowHeight: string = "";
  private destroy$: Subject<boolean> = new Subject();

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.numberOfColumns = (window.innerWidth <= 575) ? 1 : 3;
    this.rowHeight = "2:1"
    this.http.getAllZones()
    .subscribe(
      pz => {this.postalZones = pz; console.log(pz)},
      err => console.warn(err, 'Error en el pedido de las categorías')
    )
  }

  onResize(event: any) {
    this.numberOfColumns = (event?.target?.innerWidth <= 575) ? 1 : 3;
    // this.rowHeight = (event?.target?.innerWidth <= 575) ? "1:1" : "90vh"
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
