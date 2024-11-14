import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {FirebaseTSApp} from 'firebasets/firebasetsApp/firebaseTSApp'
import { environment } from '../environments/environment';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Route } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ArguedasConnect';

  auth: FirebaseTSAuth;
  isLoggedIn = false;


constructor (
  private router: Router


) {
  FirebaseTSApp.init(environment.firebaseConfig);
  this.auth = new FirebaseTSAuth();
  

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
