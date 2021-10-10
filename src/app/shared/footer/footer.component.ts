import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  formularioContacto: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]],
    comentario: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  send(e: any) {
    console.log('me enveeeeeeeeeeeeeee', e)
  }

}
