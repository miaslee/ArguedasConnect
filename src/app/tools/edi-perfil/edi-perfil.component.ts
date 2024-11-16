import { NgClass } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';




@Component({
  selector: 'app-edi-perfil',
  standalone: true,
  imports: [NgClass],
  templateUrl: './edi-perfil.component.html',
  styleUrl: './edi-perfil.component.css'
})
export class EdiPerfilComponent {
  firestore: FirebaseTSFirestore = new FirebaseTSFirestore();
  auth: FirebaseTSAuth = new FirebaseTSAuth();
  
  
  constructor(@Inject (MAT_DIALOG_DATA) public data: any, private dialog :MatDialogRef<EdiPerfilComponent>, private sharedService: SharedService){
    console.log('Datos recibidos:', data.nombre);
   
  }

  callPerfilClick1() {
    this.sharedService.triggerPerfilClick1();
    
  }
  editPerfilClick(

    InputNombre: HTMLInputElement,
    InputApellido: HTMLInputElement,
    InputFN: HTMLInputElement,
    InputGender: HTMLDivElement,
    InputPrivacidad: HTMLDivElement
  ) {
    let sexo = (InputGender.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value;
    let name = InputNombre.value;
    let lastname = InputApellido.value;
    let privacidad = (InputPrivacidad.querySelector('input[name="privacidad"]:checked') as HTMLInputElement)?.value;
    let fechaNaci = InputFN.value;
    console.log(name, lastname, sexo, privacidad, fechaNaci)
    if (this.isNotEmpty(name) && this.isNotEmpty(lastname) &&
      this.isNotEmpty(sexo) && this.isNotEmpty(privacidad) && this.isNotEmpty(fechaNaci)
    ) {
      let id = this.auth.getAuth().currentUser?.uid + "";

      this.firestore.update({
        path: ["Users", id], // Ruta al documento que deseas actualizar
        data: {
          privacidad: privacidad,
          publicFN: fechaNaci,
          publicLastname: lastname,
          publicName: name,
          publicSex: sexo

        }, // Campos adicionales o modificados
        onComplete: () => {
          this.dialog.close();
          this.callPerfilClick1();

        },
        onFail: (error) => {
          console.error("Error al actualizar el documento:", error);
        },
      });
    }


  }

  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }
}
