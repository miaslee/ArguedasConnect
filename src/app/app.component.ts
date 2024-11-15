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


constructor (
  private router: Router


) {
  FirebaseTSApp.init(environment.firebaseConfig);
  this.auth = new FirebaseTSAuth();
  this.firestore = new FirebaseTSFirestore();
  

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

          },
          whenChanged :user => {

          }


        }
      )
    }


  );
  
}
LogoutClick() {
  this.auth.signOut();
}

loggedIn(){
return this.isLoggedIn;
}

  
}
