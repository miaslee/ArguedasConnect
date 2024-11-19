import { NgIf } from '@angular/common';
import { Component, resolveForwardRef } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

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
sin : boolean ;


  firebasetsAuth: FirebaseTSAuth;
  constructor() {

    this.firebasetsAuth = new FirebaseTSAuth();
    this.init();
this.sin = false;
     this.sin = this.firebasetsAuth.isSignedIn()
     console.log(this.sin)
  }
  init() {
    setTimeout(() => {
      this.state = LoginCompState.LOGIN;
    }, 500); // Espera de 2 segundos



  }
  showNotification1(Message: string) {
    const notification = document.getElementById('notification1');
    if (notification) {

      let s = "{\"error\":{\"code\":400,\"message\":\"INVALID_LOGIN_CREDENTIALS\",\"errors\":[{\"message\":\"INVALID_LOGIN_CREDENTIALS\",\"domain\":\"global\",\"reason\":\"invalid\"}]}}";



      if (Message == "The email address is badly formatted.") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)

        notification.innerText = "La dirección de correo electrónico tiene un formato incorrecto."

      } else if (Message == s) {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Las credenciales ingresadas son incorrectas. Por favor, verifica tu correo y contraseña."


      } else if (Message == "send") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. Revisa tu bandeja de entrada y sigue las instrucciones."
      } else if (Message == "Contraseña no coincide") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Las contraseñas no coinciden. Por favor, verifica e inténtalo nuevamente.";
      } else if (Message == "Solo estudiantes") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Solo se permiten correos institucionales de la UNAJMA. Por favor, utiliza tu correo universitario válido.";
      } else if (Message == "no se puede") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "No se pudo completar el registro. Por favor, inténtalo nuevamente más tarde.";
      } else if (Message == "creado") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "¡Registro exitoso! Bienvenido a ArguedasConnect, ya puedes iniciar sesión.";
      } else if (Message == "vacio") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Por favor, completa todos los campos obligatorios antes de continuar.";

      } else if (Message == "login") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "Inicio de sesión exitoso. Bienvenido de nuevo.";
      }else if(Message == "pass 6"){
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "La contraseña debe tener como minimo 6 caracteres.";
      }else if(Message == "The email address is already in use by another account."){
        notification.innerText = "La dirección de correo electrónico ya está en uso por otra cuenta.";
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
      }
       else {
        notification.innerText = "Ocurrió un error inesperado. Por favor, inténtalo nuevamente más tarde.";
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
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
          this.showNotification1(errorMessage)

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

            this.c = false;
            this.showNotification1("login");

          },
          onFail: (err) => {
            console.log("No se puede iniciar" + err);
            this.c = false;
            const errorMessage = err.message || "Ocurrió un error desconocido";
            this.showNotification1(errorMessage);

          }
        }
      )

    }else {
      this.showNotification1("vacio"); 
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
      !this.isNotEmpty(email) ||
      !this.isNotEmpty(pass) ||
      !this.isNotEmpty(confirmPass)
    ) {
      // Caso: Uno o más campos están vacíos
      this.showNotification1("vacio");
    } else if (!this.pass6(pass)) {
      // Caso: Contraseña no cumple con la longitud mínima de 6 caracteres
      this.showNotification1("pass 6");
    } else if (!this.isAMatch(pass, confirmPass)) {
      // Caso: Contraseña y confirmación no coinciden
      this.showNotification1("Contraseña no coincide");
    } else if (!this.isUnajmaMail(email)) {
      // Caso: Email no pertenece a Unajma
      this.showNotification1("Solo estudiantes");
    } else {
      this.c = true;
      // Caso: Todos los datos son válidos
      this.firebasetsAuth.createAccountWith({
        email: email,
        password: pass,

        onComplete: (uc) => {
          this.c = false;
          this.showNotification1("creado");
          registroEmail.value = "";
          registroPass.value = "";
          registroConfirmPass.value = "";
          this.c = false;
          
        },
        onFail: (err) => {
          this.showNotification1(err.message);
          //console.log(err.message)
          this.c = false;
          
        },
      });
      
    }
    

  }
  pass6(pass: string) {
  
    return pass.length >= 6
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