import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emailverification',
  standalone: true,
  imports: [],
  templateUrl: './emailverification.component.html',
  styleUrl: './emailverification.component.css'
})
export class EmailverificationComponent {
  auth= new FirebaseTSAuth();
  constructor (private router:Router){


  }
  ngOnInit(): void
{
  if(this.auth.isSignedIn() && !this.auth.getAuth().currentUser?.emailVerified)
    {
this.auth.sendVerificationEmail();
  }else {
    this.router.navigate([""])
  }
}
  reenviarCorreo(){
    this.auth.sendVerificationEmail();


  }

}
