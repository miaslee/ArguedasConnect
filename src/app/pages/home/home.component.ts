import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component'; 
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

auth = new FirebaseTSAuth;

isLog (){
 return this.auth.isSignedIn();
}
}

