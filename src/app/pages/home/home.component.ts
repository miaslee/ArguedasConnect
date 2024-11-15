import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component'; 
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgIf } from '@angular/common';
import { CompleteProfileComponent } from '../complete-profile/complete-profile.component';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, NgIf, CompleteProfileComponent,FeedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

auth = new FirebaseTSAuth;

isLog (){
 return this.auth.isSignedIn();
}
}

