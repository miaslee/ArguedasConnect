import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp'
import { environment } from '../environments/environment';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Route } from '@angular/router';
import { NgIf } from '@angular/common';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import { FirebaseTSFirestore } from "firebasets/firebasetsFirestore/firebaseTSFirestore";
import { FeedComponent } from './pages/feed/feed.component';
import { PostComponent } from './tools/post/post.component';
import { HeaderComponent } from './tools/header/header.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SharedService } from './services/shared.service';
import { UserPerfilComponent } from './pages/user-perfil/user-perfil.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, CompleteProfileComponent, FeedComponent, PostComponent, HeaderComponent, PerfilComponent, UserPerfilComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'ArguedasConnect';

  auth: FirebaseTSAuth;
  isLoggedIn = false;
  firestore: FirebaseTSFirestore;
  userHasProfile: boolean;
  private static userDocument: userDocument | null = null;
  log: boolean;
  mailv: boolean;
  receivedId1: string | null = null; // Variable para almacenar el ID recibido

  constructor(
    private router: Router,
    private sharedService: SharedService


  ) {
    FirebaseTSApp.init(environment.firebaseConfig);
    this.auth = new FirebaseTSAuth();
    this.firestore = new FirebaseTSFirestore();
    this.userHasProfile = true;
    AppComponent.userDocument = {
      publicName: '',
      publicLastname: '',
      publicCareer: '',
      publicFN: '',
      publicSex: '',
      userId: ''
    };
    this.log = false;
    this.mailv = false;
    


    //
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(

          {
            whenSignedIn: user => {

              console.log("login")
              this.isLoggedIn = true;

            },
            whenSignedOut: user => {
              console.log("logout")
              this.isLoggedIn = false;
              AppComponent.userDocument = null;


            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"])
              this.mailv = false;

            },
            whenSignedInAndEmailVerified: user => {

              this.getUsersProfile();


            },
            whenChanged: user => {

            }


          }
        )
      }


    );
    this.sharedService.currentId1$.subscribe(id => {
      if (id) {
        this.receivedId1 = id;
    
        this.showNotification(id);

        
      }
    });

  }
  ngOnInit() {
    this.sharedService.perfilClick$.subscribe(() => {
      this.PerfilClick(); // Llama a perfilClick cuando el evento se activa
    });
    this.sharedService.perfilClick1$.subscribe(() => {

      this.AmigoClick();
      setTimeout(() => {
        this.userPerfilClick(); // Llama a userPerfilClick después de 1 segundo
        
      }, 100); // 1000 milisegundos = 1 segundo
      

    });
    this.sharedService.perfilClick2$.subscribe(() => {

      this.AmigoClick();
      setTimeout(() => {
        this.HomeClick(); // Llama a userPerfilClick después de 1 segundo
       
      }, 100); // 1000 milisegundos = 1 segundo
      

    });
   
    
    
  }

  public static getUserDocument() {
    return AppComponent.userDocument;

  }
  getUsername(): string {
    try {
      // Devuelve el nombre del usuario si está disponible
      return AppComponent.userDocument?.publicName || "Invitado";
    } catch (err) {
      // Devuelve un valor predeterminado en caso de error
      console.error("Error al obtener el nombre de usuario:", err);
      return "Invitado";
    }
  }
  getUsersProfile() {
    const user = this.auth.getAuth().currentUser;

    if (user) {
      this.firestore.listenToDocument({
        name: "Getting Document",
        path: ["Users", user.uid], // Asegúrate de incluir la colección y el UID del usuario
        onUpdate: (result) => {

          AppComponent.userDocument = <userDocument>result.data();

          // Aquí puedes manejar la actualización del documento del usuario
          
          this.userHasProfile = result.exists;
          AppComponent.userDocument.userId = this.auth.getAuth().currentUser?.uid + "";
          this.mailv = true;
        }
      });
    } else {
      console.warn("No hay un usuario autenticado.");

    }


  }


  LogoutClick() {
    this.auth.signOut();
    window.location.reload();
  }

  loggedIn() {
    this.log = this.isLoggedIn


    return this.log;
  }


  MailV() {

    return this.mailv;
  }

  state = HomeCompState.HOME;


  isHomeState() {
    return this.state == HomeCompState.HOME;
  }
  isPerfilState() {
    return this.state == HomeCompState.PERFIL;
  }
  isAmigoState() {
    return this.state == HomeCompState.AMIGOS;
  }
  isUserPerfilState() {
    return this.state == HomeCompState.USERPERFIL;
  }
  HomeClick() {
    this.state = HomeCompState.HOME;
  }
  PerfilClick() {
    this.state = HomeCompState.PERFIL;
  }
  userPerfilClick() {
    this.state = HomeCompState.USERPERFIL;
  }
  AmigoClick() {
    this.state = HomeCompState.AMIGOS;
  }
  getStateText() {

    switch (this.state) {
      case HomeCompState.HOME:
        return "Home";
      case HomeCompState.PERFIL:
        return "Perfil";
      case HomeCompState.AMIGOS:
        return "Amigos";
      case HomeCompState.USERPERFIL:
        return "User Perfil";

    }

  }
  showNotification(Message: string) {
    const notification = document.getElementById('notification');
    if (notification) {
  
      //notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
      //notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
      if (Message == "post-creado") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
       notification.innerText = "¡Publicación creada!"
        
      } else if (Message == "post-creando") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = "Creando publicación..."
  
      }else if (Message == "perfil-photo-subiendo") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = "Actualizando foto de perfil..."
      } else if (Message == "perfil-photo-actualizado") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "¡Foto de perfil actualizada exitosamente!"
      }  else if (Message == "perfil-actualizado") {
        notification.style.backgroundColor = '#28a745'; // Verde (Éxito)
        notification.innerText = "¡Datos de perfil actualizados exitosamente!"
      }  else if (Message == "perfil-actualizando") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = "Actualizando datos del perfil..."
      }  else if (Message == "") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = ""
      }  else if (Message == "") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = ""
      }  else if (Message == "") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = ""
      }  else if (Message == "") {
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
        notification.innerText = ""
      }   else{
        notification.innerText = "";
        notification.style.backgroundColor = '#3498db'; // Azul (Aviso)
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
export enum HomeCompState {
  HOME,
  PERFIL,
  AMIGOS,
  USERPERFIL

}
export interface userDocument {
  publicName: string;
  publicLastname: string;
  publicCareer: string;
  publicFN: string;
  publicSex: string;
  userId: string

}
