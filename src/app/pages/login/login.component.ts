import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  state = LoginCompState.LOGIN;

  ForgotPassClick(){
this.state = LoginCompState.FORGOT_PASSWORD;
  }
  CreateAccountClick(){
    this.state = LoginCompState.REGISTER;
  }
  LoginClick(){
    this.state = LoginCompState.LOGIN;
  }

isLoginState(){
  return this.state == LoginCompState.LOGIN;
}
isRegisterState(){
  return this.state == LoginCompState.REGISTER;
}
isForgotPasswordState(){
  return this.state == LoginCompState.FORGOT_PASSWORD;
}



  getStateText (){

    switch (this.state) {
case LoginCompState.LOGIN :
  return "Login";
  case LoginCompState.REGISTER:
    return "Register";
    case LoginCompState.FORGOT_PASSWORD :
      return "Forgot Password"
    }
  }

}

export enum LoginCompState {
LOGIN,
REGISTER,
FORGOT_PASSWORD

}