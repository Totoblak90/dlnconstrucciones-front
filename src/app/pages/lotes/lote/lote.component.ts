import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Batch, Lotes } from 'src/app/interfaces/http/batches.interface';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss'],
})
export class LoteComponent implements OnInit {
  private localidadID: string = '';
  public lotes: Batch[] = [];

  constructor(private router: Router, private httpService: HttpService) {
    this.getDataFromRoute();
  }

  ngOnInit(): void {
    this.httpService.getLotes(this.localidadID).subscribe(
      (res: Lotes) => {
        this.lotes = res?.data?.Batches;
        this.lotes.forEach(lote => lote.url = '/')
      },
      (err) => console.log(err)
    );
  }

  private getDataFromRoute(): void {
    this.localidadID = this.router.getCurrentNavigation()?.extras?.state?.data;
  }
}
