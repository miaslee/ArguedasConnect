import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostData } from '../../pages/feed/feed.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgIf } from '@angular/common';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgIf],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  @Input() postData?: PostData;
 
  auth = new FirebaseTSAuth();
 firestore = new FirebaseTSFirestore(); 
 public userProfileData: UserProfile | null = null;
  username: string = "";
  time: string = "Hace ";
  photo: string = "";
  u : boolean = false;

  constructor(private sharedService: SharedService){
    
  }

  //llamar para mostrar perfil
  callPerfilClick() {
    this.sharedService.triggerPerfilClick();
  }

  sendId(): string {
    const id = this.postData?.creatorId ?? ""; // Asigna una cadena vacía si creatorId es undefined
    this.sharedService.sendId(id); // Envía el ID a través del servicio
    this.callPerfilClick();
    return id;
}

  showPerfil(){
    
    const i = this.postData?.creatorId+"";
    
    
     
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
