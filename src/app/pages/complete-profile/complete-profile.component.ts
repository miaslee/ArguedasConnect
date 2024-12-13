import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FirebaseTSFirestore } from "firebasets/firebasetsFirestore/firebaseTSFirestore"
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent {
  @Input() show: boolean = false;
  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  perfil1 : boolean = false;

  constructor() {
    this.firestore = new FirebaseTSFirestore;
    this.auth = new FirebaseTSAuth;


  }
  ngOnInit() {
    setTimeout(() => {
      this.getUsersProfile()

    }, 3000); // 1000 milisegundos = 1 segundo

     
  }

  getUsersProfile() {
    const user = this.auth.getAuth().currentUser;

    if (user) {
      this.firestore.listenToDocument({
        name: "Getting Document",
        path: ["Users", user.uid], // Asegúrate de incluir la colección y el UID del usuario
        onUpdate: (result) => {


          // Aquí puedes manejar la actualización del documento del usuario

          const perfil = document.getElementById('perfil');
          if (perfil) {
            if (!result.exists) {
              // Mostrar la perfil
              perfil.style.display = 'block';
              //console.log("perfil")
              this.perfil1 = true;
            }


          }




        }
      });
    } else {
      console.warn("No hay un usuario autenticado.");

    }


  }


  CompleteProClick(
    InputNombre: HTMLInputElement,
    InputApellido: HTMLInputElement,
    InputCarrera: HTMLSelectElement,
    InputFN: HTMLInputElement,
    InputGender: HTMLDivElement
  ) {
    let sexo = (InputGender.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value;
    let name = InputNombre.value;
    let lastname = InputApellido.value;
    let carrera = InputCarrera.value;
    let fechaNaci = InputFN.value;



    if (this.isNotEmpty(name) && this.isNotEmpty(lastname) && this.isNotEmpty(sexo) && this.isNotEmpty(carrera)
      && this.isNotEmpty(fechaNaci)) {
      //todos los campos de perfil llenados
      const user = this.auth.getAuth().currentUser;
      if (user) {
        this.firestore.create({
          path: ["Users", user.uid],
          data: {
            publicName: name,
            publicLastname: lastname,
            publicCareer: carrera,
            publicFN: fechaNaci,
            publicSex: sexo,
            userId: this.auth.getAuth().currentUser?.uid,
            photoUrl: "https://devmiasx.com/uploads/67380645a9ac3_user.png",
            privacidad: "publico",
            verificado: "false"


          },
          onComplete: (docId: string) => {

            this.showNotification2("creado");



            InputNombre.value = "";
            InputApellido.value = "";
            InputCarrera.value = "";
            InputFN.value = "";

          },
          onFail: (err: any) => {
            alert(err);
            this.showNotification2("error");
          }
        });
      } else {
       // console.log("No hay un usuario autenticado.");
      }
    } else {
     // console.log("Completa todos los campos")
      this.showNotification2("vacio");
    }

  }
  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }
  showNotification2(Message: string) {
    const notification = document.getElementById('notification2');
    if (notification) {


      if (Message == "vacio") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Por favor, completa todos los campos requeridos antes de continuar."

      } else if (Message == "creado") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "¡Perfil completado con éxito! Gracias por proporcionar tu información."

      } else if (Message == "error") {
        notification.style.backgroundColor = '#dc3545'; // Rojo (Error)
        notification.innerText = "Ocurrió un error inesperado. Por favor, inténtalo nuevamente más tarde."

      } else {
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

}
