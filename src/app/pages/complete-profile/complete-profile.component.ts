import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import {FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore"
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [NgClass],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent {
@Input() show: boolean = false;
firestore : FirebaseTSFirestore;
auth : FirebaseTSAuth;

constructor(){
  this.firestore =  new FirebaseTSFirestore;
  this.auth = new FirebaseTSAuth;

}
CompleteProClick(
  InputNombre:HTMLInputElement, 
  InputApellido:HTMLInputElement,
   InputCarrera:HTMLSelectElement,
   InputFN:HTMLInputElement,
   InputGender: HTMLDivElement
){
  let sexo = (InputGender.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value;
let name = InputNombre.value;
let lastname =  InputApellido.value;
let carrera =  InputCarrera.value;
let fechaNaci = InputFN.value;



if(this.isNotEmpty(name)&& this.isNotEmpty(lastname) &&this.isNotEmpty(sexo) && this.isNotEmpty(carrera) 
&& this.isNotEmpty(fechaNaci)  ){
  //todos los campos de perfil llenados
  const user = this.auth.getAuth().currentUser;
  if (user) {
    this.firestore.create({
      path: ["Users", user.uid],
      data: {
        publicName: name,
        publicLastname: lastname,
        publicCareer: carrera,
        publicFN: fechaNaci,
        publicSex: sexo,
        userId: this.auth.getAuth().currentUser?.uid,
        photoUrl: "https://devmiasx.com/uploads/67380645a9ac3_user.png",
        privacidad: "publico"
  
      },
      onComplete: (docId: string) => {
        alert("Perfil creado");
  
  
        InputNombre.value = "";
         InputApellido.value ="";
         InputCarrera.value="";
         InputFN.value="";
  
      },
      onFail: (err: any) => {
        alert(err);
      }
    });
  } else {
    alert("No hay un usuario autenticado.");
  }
}else{
  console.log("Completa todos los campos")
}

}
isNotEmpty(text: string){
  return text != null && text.length > 0;
}
}
