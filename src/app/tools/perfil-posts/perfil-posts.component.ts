import { Component, Input } from '@angular/core';
import { PostData } from '../../pages/perfil/perfil.component';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import firebase from "firebase/app";



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
  photo: string = "";
  u: boolean = false;
  public userProfileData: UserProfile | null = null;
  l: string = "♡"
  n: any;
  public likeData: likes | null = null;
  private isProcessingLike: boolean = false;

  constructor() {

  }
  ngOnInit() {
    this.getInfoProfile();
    this.update();
    this.n = this.postData?.likes;

  }
  update() {

    const postId = this.postData?.id ?? ""; // ID del post actual
    const userId = this.auth.getAuth().currentUser?.uid ?? ""; // ID del usuario actual



    const likeId = `${postId}_${userId}`; // ID único para el like
    const likePath = ["Likes", likeId]; // Ruta del documento en Firestore

    this.firestore.getDocument({
      path: likePath,
      onComplete: (result) => {
        if (result.exists) {

          this.l = "♥"; // Actualizar visualmente el estado

        } else {

          this.l = "♡"; // Actualizar visualmente el estado

        }
      },
      onFail: (error) => {
        console.error("Error al verificar el like:", error);
      },
    });
  }
  Like() {
    if (this.isProcessingLike) {
     
      return; // No permite presionar si ya se está procesando
    }
  
    // Activar la bandera de procesamiento
    this.isProcessingLike = true;
  
    const postId = this.postData?.id || ""; // ID del post actual
    const user = this.auth.getAuth().currentUser; // Usuario actual
    const userId = user?.uid || ""; // ID del usuario actual
  
    if (!postId || !userId) {
      console.error("PostId o UserId no disponibles");
      this.isProcessingLike = false; // Restablecer la bandera
      return;
    }
  
    const likeId = `${postId}_${userId}`; // ID único para el like
    const likePath = ["Likes", likeId]; // Ruta del documento del like
  
    // Verificar si el like ya existe
    this.firestore.getDocument({
      path: likePath,
      onComplete: (result) => {
        if (result.exists) {
          this.l = "♡";
          this.n = this.n - 1;
  
          // Quitar el like
          this.firestore.delete({
            path: likePath,
            onComplete: async () => {
              await this.disLike(postId);
              this.isProcessingLike = false; // Restablecer la bandera
            },
            onFail: (error) => {
              console.error("Error al quitar el like:", error);
              this.isProcessingLike = false; // Restablecer la bandera
            },
          });
        } else {
          this.l = "♥";
          this.n = this.n + 1;
  
          // Crear el like
          this.firestore.create({
            path: likePath,
            data: {
              postId: postId,
              userId: userId,
            },
            onComplete: async () => {
              await this.addLike(postId);
              this.isProcessingLike = false; // Restablecer la bandera
            },
            onFail: (error) => {
              console.error("Error al agregar el like:", error);
              this.isProcessingLike = false; // Restablecer la bandera
            },
          });
        }
      },
      onFail: (error) => {
        console.error("Error al verificar el like:", error);
        this.isProcessingLike = false; // Restablecer la bandera
      },
    });
  }
  
  // Función para agregar un like
  addLike(postId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.firestore.update({
        path: ["Posts", postId], // Ruta al documento específico
        data: {
          likes: firebase.firestore.FieldValue.increment(1), // Incrementa el campo "likes"
        },
        onComplete: () => {
          resolve(true); // Indicar que se completó con éxito
        },
        onFail: (error) => {
          console.error("Error al incrementar los likes:", error);
          resolve(false); // Indicar que hubo un error
        },
      });
    });
  }
  
  // Función para quitar un like
  disLike(postId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.firestore.update({
        path: ["Posts", postId], // Ruta al documento específico
        data: {
          likes: firebase.firestore.FieldValue.increment(-1), // Decrementa el campo "likes"
        },
        onComplete: () => {
          resolve(true); // Indicar que se completó con éxito
        },
        onFail: (error) => {
          console.error("Error al decrementar los likes:", error);
          resolve(false); // Indicar que hubo un error
        },
      });
    });
  }

  getInfoProfile() {
    let userId = this.auth.getAuth().currentUser?.uid;

    this.firestore.getCollection(
      {
        path: ["Users"],
        where: [

        ],

        onComplete: (result) => {
          result.docs.forEach(
            doc => {

              this.userProfileData = doc.data() as UserProfile;
              if (this.postData?.creatorId == this.userProfileData.userId) {
                this.u = true;
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
                  //console.log("El timestamp del post no está disponible.");
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
  userId: string;
  photoUrl: string
}
export interface likes {
  likeId: string
}
