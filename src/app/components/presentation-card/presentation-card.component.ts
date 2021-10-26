import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss']
})
export class PresentationCardComponent  {
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;
  @Input() ruta: string = "";
  @Input() urlFoto: string = "";
  @Input() titulo: string = "";

  constructor() { }

}
