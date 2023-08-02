import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.services';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public emailControl = new FormControl ('mock@mail.com', [Validators.required, Validators.email]);
  public passwordControl = new FormControl('1', [Validators.required]);

  public loginForm = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,

  });

  constructor (private authService: AuthService){}

  login (): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }else{

      this.authService.login (this.loginForm.getRawValue())
    }

  }

}
