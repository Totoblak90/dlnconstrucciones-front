import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.scss']
})
export class TipoServicioComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const serviceId = this.activeRoute.snapshot.params.servicioId;
    this.httpService.getOneService(serviceId)
      .subscribe(serv => console.log(serv))

  }

}
