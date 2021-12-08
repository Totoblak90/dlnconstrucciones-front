import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PresentationCard } from 'src/app/interfaces/presentation-card.interface';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
})
export class PresentationCardComponent {
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;
  @Input() presentationCard: PresentationCard[] = [];

  public showMore: boolean = false;

  constructor(private router: Router) {}

  public navigate(ruta: string, data: PresentationCard) {
    if (!data.sendDataByRoute) {
      this.router.navigateByUrl(ruta);
    } else {
      this.router.navigateByUrl(ruta, { state: data.urlData });
    }
  }
}
