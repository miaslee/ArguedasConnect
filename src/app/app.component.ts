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

  }
  ngOnInit() {
    this.sharedService.perfilClick$.subscribe(() => {
      this.PerfilClick(); // Llama a perfilClick cuando el evento se activa
    });
    this.sharedService.perfilClick1$.subscribe(() => {
      //this.userPerfilClick(); // Llama a perfilClick cuando el evento se activa
     //esperar 1 segundo 
     this.HomeClick();
     setTimeout(() => {
      this.userPerfilClick(); // Llama a userPerfilClick después de 1 segundo
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
          console.log("Documento del perfil de usuario actualizado:", result);
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
