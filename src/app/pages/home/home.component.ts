import { DOCUMENT } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import { PresentationCard } from 'src/app/interfaces/presentation-card.interface';
import { ModalComponent } from './modal/modal.component';
import { DownloadAnchor } from '../../interfaces/presentation-card.interface';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  firstSection!: HTMLCollectionOf<Element>;
  secondSection!: HTMLCollectionOf<Element>;
  thirdSection!: HTMLCollectionOf<Element>;
  sectionFour!: HTMLCollectionOf<Element>;

  cardsList: PresentationCard[] = [
    {
      imagePath: '../../../assets/slider1.jpg',
      title: `Más de 15 años construyendo confianza`,
      description: 'Nuestro éxito se basa en los exigentes controles de calidad a los que sometemos todos los proyectos que realizamos'
    },
    {
      imagePath: '../../../assets/llave-en-mano.jpg',
      title: 'Proyectos llave en mano',
      description: 'Te entregamos la casa lista para usar'
    },
    {
      imagePath: '../../../assets/lote.jpg',
      title: `Lotes en venta`,
      routerAnchor: { route: '/lotes', innerText: 'Ver más' }
    },
    {
      imagePath: '../../../assets/plano.png',
      title: '¿Ya tenés tu lote en Costa Esmeralda?',
      routerAnchor: {route: '/auth', innerText: "Ingresá"},
      downloadAnchor: {href: '../../../assets/masterplan.pdf', innerText: 'MASTERPLAN'}
    },
    {
      imagePath: '../../../assets/quienes-somos-3.jpg',
      title: 'Proyecto, ejecución y dirección de obra',
      description: 'Nos ocupamos de todo para que vos no te ocupes de nada'
    },
    {
      imagePath: '../../../assets/slider2.jpg',
      title: 'Antenas de Telecomunicaciones',
      description: 'Servicio de ejecución de obras a empresas de telecomunicaciones'
    }
  ]


  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.firstSection = document.getElementsByClassName('first-section')
    this.secondSection = document.getElementsByClassName('second-section')
    this.thirdSection = document.getElementsByClassName('third-section')
    this.sectionFour = document.getElementsByClassName('section-four')
  }

  ngAfterViewInit(): void {
    this.animations();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(
      ModalComponent,
      {
        width: '50%',
        data: null
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  animations(): void {
    const tl = gsap.timeline()
    tl.
    from(this.firstSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.5,
    })
    .from(this.secondSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.5

    })
    .from(this.thirdSection, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
    })
    .from(this.sectionFour, {
      duration: 0.5,
      opacity: 0,
      xPercent: -10,
      delay: 0.2
    })
  }

}
