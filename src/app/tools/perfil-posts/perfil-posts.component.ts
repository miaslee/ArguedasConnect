import { Component, Input } from '@angular/core';
import { PostData } from '../../pages/perfil/perfil.component';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-perfil-posts',
  standalone: true,
  imports: [NgIf],
  templateUrl: './perfil-posts.component.html',
  styleUrl: './perfil-posts.component.css'
})
export class PerfilPostsComponent {

  @Input() postData?: PostData;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore(); 
  username: string = "";
  time: string = "";
  photo : string = "";
  u : boolean = false;
  public userProfileData: UserProfile | null = null;

  constructor(){
    
  }
  ngOnInit() {
    this.getInfoProfile();
  
  }
  getInfoProfile (){
    let userId = this.auth.getAuth().currentUser?.uid;
    
    this.firestore.getCollection(
    {
      path:["Users"],
      where: [
        
      ],
      
      onComplete: (result) => {
    result.docs.forEach(
      doc => {
       
       this.userProfileData = doc.data() as UserProfile;
       if(this.postData?.creatorId == this.userProfileData.userId){
        this.u  = true;
        this.username = this.userProfileData.publicName + " " + this.userProfileData.publicLastname;
        this.photo = this.userProfileData.photoUrl;
        console.log("photo" + this.photo)
        //time
        const timePost = this.postData?.timestamp ? this.postData.timestamp.toMillis() : null;
        const timeNow = Date.now();


        if (timePost) {
          const difference = timeNow - timePost;
      
          // Conversión a unidades de tiempo
          const seconds = Math.floor(difference / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);
      
          // Muestra en consola el tiempo transcurrido
          if (days > 0) {
            this.time = (`Hace ${days} días`);
             
          } else if (hours > 0) {
              
              this.time = (`Hace ${hours} horas`);
          } else if (minutes > 0) {
             
              this.time = (`Hace ${minutes} minutos`);
          } else {
              
              this.time = (`Hace ${seconds} segundos`);
          }
      } else {
          console.log("El timestamp del post no está disponible.");
      }
       }

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
  publicLastname: string;
  userId : string;
  photoUrl: string
}

