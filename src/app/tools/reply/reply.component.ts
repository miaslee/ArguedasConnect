import { Component, Inject } from '@angular/core';
import { FirebaseTSFirestore, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from '../../app.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css'
})
export class ReplyComponent {
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();
  public userProfileData: UserProfile | null = null;
  comments :Comment [] = [];
  c : boolean = false;
  photoUrl: string = "";




  constructor(@Inject(MAT_DIALOG_DATA) private id: string, private sharedService: SharedService, private dialog: MatDialogRef<ReplyComponent>){
    
  }
ngOnInit(): void {
  this.getComment();
}

getComment() {
  this.firestore.listenToCollection(
    {
      name: "Post Comments",
      path: ["Posts", this.id, "PostComments"],
      where: [new OrderBy("timestamp", "asc")],
      onUpdate: (result) => {
        result.docChanges().forEach((postComentDoc) => {
          if (postComentDoc.type === "added") {
            // Obtén los datos del comentario
            const commentData = <Comment>postComentDoc.doc.data();

            // Busca los datos del usuario (autor del comentario) usando creatorId
            this.firestore.getDocument({
              path: ["Users", commentData.creatorId],
              onComplete: (userDoc) => {
                const userData = <UserProfile>userDoc.data();

                if (userData) {
                  // Agrega los datos del autor al comentario
                  commentData.creatorName = `${userData.publicName} ${userData.publicLastname}`;
                  commentData.photoUrl = userData.photoUrl;
                  commentData.verificado = userData.verificado
                } else {
                  // Si no se encuentran datos del usuario, usa valores por defecto
                  commentData.creatorName = "Usuario desconocido";
                  commentData.photoUrl = "ruta_por_defecto_de_imagen.jpg"; // Foto por defecto
                }

                // Agrega el comentario a la lista de comentarios
                this.comments.unshift(commentData);
                
              },
              onFail: (err) => {
                console.error("Error al obtener los datos del usuario:", err);

                // Si falla, usa valores por defecto
                commentData.creatorName = "Usuario desconocido";
                commentData.photoUrl = "ruta_por_defecto_de_imagen.jpg";
                this.comments.unshift(commentData);
              },
            });
          }
        });
        this.c = true; // Indica que los comentarios han sido cargados
      },
    }
  );
}


  
  onSendClick(commentInput:HTMLInputElement) {
   
    let name = this.userProfileData?.publicName;
    let lastname = this.userProfileData?.publicLastname+"";
    let photoUrl = this.userProfileData?.photoUrl;

    if(commentInput.value.length>0){
      this.firestore.create(
  
        {
          path: ["Posts", this.id, "PostComments"],
          data: {
            comment : commentInput.value,
            creatorId : this.auth.getAuth().currentUser?.uid,
          
            timestamp : Date.now(),
           
      
          },
          onComplete: (docId) => {
            commentInput.value = "";
          }
        }
      )
      commentInput.value = "";
    }

  }

  sendId(id:string): string {
    //const id = this.publicaciones[0]?.autor // Asigna una cadena vacía si creatorId es undefined
    //comprobar si entramos a nuestro perfil
    if (id == this.auth.getAuth().currentUser?.uid) {
      this.dialog.close();
      this.callPerfilClick1();

    } else {
      this.sharedService.sendId(id); // Envía el ID a través del servicio
      this.dialog.close();
      this.callPerfilClick();

    }
    return id;
  }
    //llamar para mostrar perfil
    callPerfilClick() {
      this.sharedService.triggerPerfilClick();
    }
    callPerfilClick1() {
      this.sharedService.triggerPerfilClick1();
    }
  
}


export interface UserProfile {
  publicName: string
  publicLastname : string,
  photoUrl:  string
  userId: string
  verificado:string
}
export interface Comment {
  creatorId: string;
  creatorName: string;
  comment: string;

  timestamp : firebase.default.firestore.Timestamp
  photoUrl:  string
  authorName?: string
  authorPhoto?:string
  verificado?: string
}
