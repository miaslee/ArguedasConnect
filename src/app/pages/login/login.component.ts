import { NgIf } from '@angular/common';
import { Component, resolveForwardRef } from '@angular/core';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  state = LoginCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;
  constructor (){

    this.firebasetsAuth = new FirebaseTSAuth();
  }


  ResetPass(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail({
        email:email,
        onComplete: (err) => {
          alert("Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Revisa tu bandeja de entrada y sigue las instrucciones.");
        
        }
      }


      );
    }

  }

Login(loginEmail: HTMLInputElement,
  loginPass: HTMLInputElement
){
  let email = loginEmail.value;
  let pass = loginPass.value;

   if(this.isNotEmpty(email) && this.isNotEmpty(pass))
{
  this.firebasetsAuth.signInWith(
    {
      email:email,
      password : pass,
      onComplete: (uc) => {
    alert("Logged");
      },
      onFail : (err) => {
        alert("No se puede iniciar"+ err);
      }
    }
  )
}

   
}


  Registro(
    
     registroEmail: HTMLInputElement,
     registroPass: HTMLInputElement,
      registroConfirmPass: HTMLInputElement
  ){
    
    let email = registroEmail.value;
    let pass = registroPass.value;
    let confirmPass =  registroConfirmPass.value;

    if(
      
      this.isNotEmpty(email) &&
      this.isNotEmpty(pass) && 
      this.isUnajmaMail(email) &&
      this.isNotEmpty(confirmPass) &&
      this.isAMatch(pass, confirmPass)
    ){
      this.firebasetsAuth.createAccountWith({
        email: email,
        password: pass,
        onComplete: (uc) => {
            alert("Cuenta creada con éxito:");
            
            registroEmail.value ="";
            registroPass.value ="";
            registroConfirmPass.value ="";
        },
        onFail: (err) => {
            alert("Error al crear la cuenta: " + err);
        }
    });

    }else if (!this.isUnajmaMail(email)){
      alert("Solo estudiantes de UNAJMA se pueden registrar")

    }else if(this.isUnajmaMail(email) && !this.isAMatch(pass, confirmPass)) {
      alert("Contraseña no coincide")

    }

    else{
      
      alert("No te puedes registrar")
    }

   
    
  }
  isUnajmaMail (text : string) {
    return text.endsWith("@unajma.edu.pe");
  }

  isNotEmpty(text: string){
    return text != null && text.length > 0;
  }

  isAMatch(text : string, text2 : string){
    return text == text2;

  }

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