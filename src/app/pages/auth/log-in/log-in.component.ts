import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  private emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public loginForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)], ],
      password: ['', [Validators.required], ],
      rememberMe: [false]
    }
  )

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log(this.loginForm)
  }

}
