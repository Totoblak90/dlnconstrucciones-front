import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { PostalZones } from '../../interfaces/http/batches.interface';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit {

  postalZones!: PostalZones;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.getAllZones()
    .subscribe(
      pz => {this.postalZones = pz; console.log(this.postalZones)},
      err => console.warn(err, 'Error en el pedido de las categorías')
    )
  }

}
