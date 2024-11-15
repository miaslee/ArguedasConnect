import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf,PostComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
 auth = new FirebaseTSAuth();
 firestore = new FirebaseTSFirestore(); 
 public userProfileData: UserProfile | null = null;
 constructor(){
  this.getInfoProfile();
 }

  getInfoProfile (){
    let userId = this.auth.getAuth().currentUser?.uid;
    
    this.firestore.getCollection(
    {
      path:["Users"],
      where: [
        new Where("userId","==",userId)
         
      ],
      
      onComplete: (result) => {
    result.docs.forEach(
      doc => {
       
       
        this.userProfileData = doc.data() as UserProfile; 
       
       //console.log(post);
      }
    )
    
        
      },
      onFail: err => {
        
      }
    }
    
    );
    }

}

export interface UserProfile {
  publicName: string;
  publicCareer: string;
  publicFN: string;
  publicLastname: string;
  publicSex: string;
}



