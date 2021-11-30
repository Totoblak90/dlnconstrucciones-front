import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss'],
})
export class PresentationCardComponent {
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;
  @Input() ruta?: string = '';
  @Input() urlFoto?: string = '';
  @Input() titulo?: string = '';
  @Input() sendDataByRoute?: boolean = false;
  @Input() urlData?: {
    data: any;
  };

  constructor(private router: Router) {}

  navigate(ruta: string) {
    if (!this.sendDataByRoute) {
      this.router.navigateByUrl(ruta);
    } else {
      this.router.navigateByUrl(ruta, {state: this.urlData})
    }
  }
}
