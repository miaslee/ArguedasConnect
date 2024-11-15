import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {FirebaseTSApp} from 'firebasets/firebasetsApp/firebaseTSApp'
import { environment } from '../environments/environment';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Route } from '@angular/router';
import { NgIf } from '@angular/common';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import{FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgIf, CompleteProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'ArguedasConnect';

  auth: FirebaseTSAuth;
  isLoggedIn = false;
  firestore:  FirebaseTSFirestore;
 userHasProfile : boolean;
 userDocument: userDocument;
 log :boolean;

constructor (
  private router: Router


) {
  FirebaseTSApp.init(environment.firebaseConfig);
  this.auth = new FirebaseTSAuth();
  this.firestore = new FirebaseTSFirestore();
  this.userHasProfile = true;
  this.userDocument = {
    publicName: '',
    publicLastname: '',
    publicCareer: '',
    publicFN: '',
    publicSex: ''
  };
  this.log = false;
  

  //
  this.auth.listenToSignInStateChanges(
    user => {
      this.auth.checkSignInState (

        {
          whenSignedIn: user => {
          
        console.log("login")
        this.isLoggedIn = true;
          },
          whenSignedOut: user => {
            console.log("logout") 
            this.isLoggedIn = false;

          },
          whenSignedInAndEmailNotVerified : user => {
            this.router.navigate(["emailVerification"])
            

          },
          whenSignedInAndEmailVerified : user =>{
            this.getUsersProfile();

          },
          whenChanged :user => {

          }


        }
      )
    }


  );
  
}
getUsersProfile() {
  const user = this.auth.getAuth().currentUser;

  if (user) {
    this.firestore.listenToDocument({
      name: "Getting Document",
      path: ["Users", user.uid], // Asegúrate de incluir la colección y el UID del usuario
      onUpdate: (result) => {
       
      this.userDocument =<userDocument> result.data();
     
        // Aquí puedes manejar la actualización del documento del usuario
        console.log("Documento del perfil de usuario actualizado:", result);
        this.userHasProfile =result.exists; 
      }
    });
  } else {
    console.warn("No hay un usuario autenticado.");
    
  }
}


LogoutClick() {
  this.auth.signOut();
}

loggedIn(){
  this.log = this.isLoggedIn
  
return this.log;
}

  
}
export interface userDocument {
  publicName: string;
      publicLastname: string;
      publicCareer: string;
      publicFN: string;
      publicSex: string;
}
