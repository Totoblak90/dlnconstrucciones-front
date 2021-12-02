import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  public registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.max(99999999), Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    terminosYCondiciones: [false, [Validators.required]]
  })
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  register(): void {
    this.registerForm.markAllAsTouched()
    console.log(this.registerForm.value)
  }
}
