import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-presentation-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss']
})
export class PresentationCardComponent implements OnInit {

  @Input() imagePath!: string;
  @Input() title!: string;
  @Input() description?: string;
  @Input() routerAnchor?: {route: string, innerText: string};
  @Input() downloadAnchor?: {href: string, innerText: string};

  constructor() { }

  ngOnInit(): void {
  }

}
