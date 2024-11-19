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
  auth = new FirebaseTSAuth();
  constructor(private router: Router) {
    
  }
  async ngOnInit() {
    try {
      if (this.auth.isSignedIn()) {
        const currentUser = this.auth.getAuth().currentUser;
        if (currentUser?.emailVerified) {
          console.log("El correo ya está verificado.");
        } else {
          await this.auth.sendVerificationEmail();
          console.log("Correo de verificación enviado.");
        }
      } else {
        console.log("El usuario no está autenticado.");
        this.router.navigate(["login"]);
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error);
    }
    
    
  }
  reenviarCorreo() {
    this.auth.sendVerificationEmail();
  }

}
