import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public formularioContacto: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  private destroy$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private httpSrv: HttpService) {}

  ngOnInit(): void {}

  send() {
    this.formularioContacto.markAllAsTouched();
    if (this.formularioContacto.valid) {
      this.httpSrv
        .sendContactForm(this.formularioContacto.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            Swal.fire(
              '¡Gracias!',
              'Recibimos correctamente tu comentario. Te responderemos a la brevedad',
              'success'
            );
          },
          () => {
            Swal.fire(
              '¡Lo sentimos!, Tuvimos un inconveniente inesperado, por favor intentá de nuevo',
              'error'
            );
          }
        );
    }
  }
}
