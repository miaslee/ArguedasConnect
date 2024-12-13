import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostData } from '../../pages/feed/feed.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgIf } from '@angular/common';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { SharedService } from '../../services/shared.service';
import firebase from "firebase/app";
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';


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
  public likeData: likes | null = null;
  username: string = "";
  time: string = "Hace ";
  photo: string = "";
  verificado : boolean = false
  u: boolean = false;
  carrera: string = "";
  l: string = "♡"
  n: any;
  ll: boolean = false;
  private isProcessingLike: boolean = false;
  userId:string;

  constructor(private sharedService: SharedService, private dialog: MatDialog) {
    this.userId = this.auth.getAuth().currentUser?.uid + "";


  }

  
  ngOnInit(): void {
    this.update()
    this.getInfoProfile();

    this.n = this.postData?.likes;

  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData?.id });
    
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


  // like() se llama al presionar el boton de like
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

  //llamar para mostrar perfil
  callPerfilClick() {
    this.sharedService.triggerPerfilClick();
  }
  callPerfilClick1() {
    this.sharedService.triggerPerfilClick1();
  }
  callPerfilClick2() {
    this.sharedService.triggerPerfilClick2();

  }
  borrarPost(id : any){
    if (!id) {
      console.error("El ID del evento es inválido o está vacío.");
     // alert("Ocurrió un error al intentar eliminar el evento.");
      return;
    }
  
    this.firestore.delete({
      path: ["Posts", id],
      onComplete: () => {
       // this.showNotification("grp-delete")
       this.callPerfilClick2()
       
        
      },
      onFail: (error) => {
        console.error("Error al eliminar el evento:", error);
      }
    });
  }


  sendId(): string {
    const id = this.postData?.creatorId ?? ""; // Asigna una cadena vacía si creatorId es undefined
    //comprobar si entramos a nuestro perfil
    if (id == this.auth.getAuth().currentUser?.uid) {
      this.callPerfilClick1();

    } else {
      this.sharedService.sendId(id); // Envía el ID a través del servicio
      this.callPerfilClick();

    }
    return id;
  }

  showPerfil() {

    const i = this.postData?.creatorId + "";



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
                this.carrera = this.userProfileData.publicCareer;
if(this.userProfileData.verificado == "true"){
  
  this.verificado=true

}
if(this.userProfileData.verificado == "false"){
  
  this.verificado=false

}

               
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
  userId: string;
  photoUrl: string
  publicCareer: string
  verificado: string
}
export interface likes {
  likeId: string
}
