import { NgIf } from '@angular/common';
import { Component, resolveForwardRef } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  state = LoginCompState.BLANK;
  c: boolean = false;


  firebasetsAuth: FirebaseTSAuth;
  constructor() {

    this.firebasetsAuth = new FirebaseTSAuth();
    this.init();


  }
  init() {
    setTimeout(() => {
      this.state = LoginCompState.LOGIN;
    }, 500); // Espera de 2 segundos

  }
  showNotification(Message: string) {
    const notification = document.getElementById('notification');
    if (notification) {

      let s = "{\"error\":{\"code\":400,\"message\":\"INVALID_LOGIN_CREDENTIALS\",\"errors\":[{\"message\":\"INVALID_LOGIN_CREDENTIALS\",\"domain\":\"global\",\"reason\":\"invalid\"}]}}";


      if (Message == "The email address is badly formatted.") {

        notification.innerText = "La dirección de correo electrónico tiene un formato incorrecto."
      } else if (Message == s) {

        notification.innerText = "Las credenciales ingresadas son incorrectas. Por favor, verifica tu correo y contraseña."


      } else if (Message == "send") {
        notification.innerText = "Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Revisa tu bandeja de entrada y sigue las instrucciones."
      } else if (Message == "Contraseña no coincide") {
        notification.innerText = "Las contraseñas no coinciden. Por favor, verifica e inténtalo nuevamente.";
      } else if (Message == "Solo estudiantes") {
        notification.innerText = "Solo se permiten correos institucionales de la UNAJMA. Por favor, utiliza tu correo universitario válido.";
      } else if (Message == "no se puede") {
        notification.innerText = "No se pudo completar el registro. Por favor, inténtalo nuevamente más tarde.";
      } else if (Message == "creado") {
        notification.innerText = "¡Registro exitoso! Bienvenido a ArguedasConnect, ya puedes iniciar sesión.";
      } else if (Message == "vacio") {
        notification.innerText = "Por favor, completa todos los campos obligatorios antes de continuar.";
      } else if (Message == "") {
        notification.innerText = "";
      }



      // Establecer el mensaje de error
      //notification.innerText = Message;

      // Mostrar la notificación
      notification.style.display = 'block';

      // Después de 3 segundos, añade la clase para desvanecer
      setTimeout(() => {
        notification.classList.add('hide');
      }, 3000);

      // Después de 4 segundos, oculta completamente la notificación
      setTimeout(() => {
        notification.style.display = 'none';
        notification.classList.remove('hide'); // Resetea para reutilizar la notificación
      }, 4000);
    }
  }



  ResetPass(resetEmail: HTMLInputElement) {
    let email = resetEmail.value;
    if (this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail({
        email: email,
        onComplete: (err) => {
          let errorMessage = "send";
          this.showNotification(errorMessage)

        }
      }
      );
    }

  }

  Login(loginEmail: HTMLInputElement,
    loginPass: HTMLInputElement
  ) {

    let email = loginEmail.value;
    let pass = loginPass.value;

    if (this.isNotEmpty(email) && this.isNotEmpty(pass)) {
      this.c = true;
      this.firebasetsAuth.signInWith(
        {
          email: email,
          password: pass,
          onComplete: (uc) => {
            console.log("Logged")
            this.c = false;

          },
          onFail: (err) => {
            console.log("No se puede iniciar" + err);
            this.c = false;
            const errorMessage = err.message || "Ocurrió un error desconocido";
            this.showNotification(errorMessage);

          }
        }
      )

    }


  }


  Registro(

    registroEmail: HTMLInputElement,
    registroPass: HTMLInputElement,
    registroConfirmPass: HTMLInputElement
  ) {

    let email = registroEmail.value;
    let pass = registroPass.value;
    let confirmPass = registroConfirmPass.value;

    if (

      this.isNotEmpty(email) &&
      this.isNotEmpty(pass) &&
      this.isUnajmaMail(email) &&
      this.isNotEmpty(confirmPass) &&
      this.isAMatch(pass, confirmPass)
    ) {

      this.firebasetsAuth.createAccountWith({
        email: email,
        password: pass,
        onComplete: (uc) => {

          this.showNotification("creado");

          registroEmail.value = "";
          registroPass.value = "";
          registroConfirmPass.value = "";
        },
        onFail: (err) => {
         // alert("Error al crear la cuenta: " + err);
          this.showNotification("no se puede");
        }
      });

    } else if (this.isNotEmpty(email) &&
    this.isNotEmpty(pass) && 
    this.isNotEmpty(confirmPass) && !this.isUnajmaMail(email)) {

      this.showNotification("Solo estudiantes");

    } else if (this.isUnajmaMail(email) && !this.isAMatch(pass, confirmPass)) {

      this.showNotification("Contraseña no coincide");

    }

    else {
      this.showNotification("vacio");
    }



  }
  isUnajmaMail(text: string) {
    return text.endsWith("@unajma.edu.pe");
  }

  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }

  isAMatch(text: string, text2: string) {
    return text == text2;

  }

  ForgotPassClick() {
    this.state = LoginCompState.FORGOT_PASSWORD;
  }
  CreateAccountClick() {
    this.state = LoginCompState.REGISTER;
  }
  LoginClick() {
    this.state = LoginCompState.LOGIN;
  }

  isLoginState() {
    return this.state == LoginCompState.LOGIN;
  }
  isRegisterState() {
    return this.state == LoginCompState.REGISTER;
  }
  isForgotPasswordState() {
    return this.state == LoginCompState.FORGOT_PASSWORD;
  }
  isLoggin() {
    return this.firebasetsAuth.isSignedIn();
  }



  getStateText() {

    switch (this.state) {
      case LoginCompState.BLANK:
        return "Blank";
      case LoginCompState.LOGIN:
        return "Login";
      case LoginCompState.REGISTER:
        return "Register";
      case LoginCompState.FORGOT_PASSWORD:
        return "Forgot Password"
    }
  }

}

export enum LoginCompState {
  BLANK,
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD

}