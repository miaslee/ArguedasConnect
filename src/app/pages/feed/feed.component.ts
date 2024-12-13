import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { CreatePostComponent } from '../../tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';
import { NgFor, NgIf } from '@angular/common';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Timestamp } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { userDocument } from '../../app.component';
import { FormsModule, NgModel } from '@angular/forms';
import { Grupo } from '../grupos/grupos.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent, NgFor, NgIf, FormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();
  searchTerm: string = '';
  posts: PostData[] = [];
  photo: string = "";
  name: string = "";
  b: boolean = false;
  p: boolean = false;
  public userProfileData: UserProfile[] = [];
  grupos: any[] = []; // Lista de usuarios con rol "docente"
  eventos: any[] = []; // Lista de usuarios con rol "docente"

  // Lista de usuarios filtrada
  filteredGroups() {
    return this.userProfileData.filter(user =>
      (user.publicLastname?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '') ||
      (user.publicName.toLowerCase().includes(this.searchTerm.toLowerCase()) || '')
    );
  }


  constructor(private dialog: MatDialog, private sharedService: SharedService) {
    this, this.getGrupo()
    this.getEvento()

  }
  ngOnInit(): void {
    this.getPosts();
    this.getInfo();
    

  }

  aGrupo() {
    this.sharedService.triggerPerfilClick5();
  }
  aEvento() {
    this.sharedService.triggerPerfilClick6();
  }


  showFeed(valor: Grupo) {
   this.aGrupo()

   this.sharedService.sendId3(valor);// Envía el ID a través del servicio
    
  

  }


  eventInfo(evt:any){
    this.dialog.open(EventDetailComponent, {
      data: { event: evt } // Aquí pasas el evt como parámetro
    });
  }



  getGrupo() {
    let i = this.auth.getAuth().currentUser?.uid + "";
    // Consulta directa a la colección "t-users" para filtrar por rol "docente"
    this.firestore.getCollection({
      path: ["grupos"], // Ruta a la colección
      where: [new Where("miembros", "array-contains", i)], // Filtra usuarios con rol "docente"
      onComplete: (result) => {
        result.docs.forEach((doc) => {
          const decano = doc.data(); // Obtiene los datos del documento
          //docente.userId = doc.id; // Agrega el ID del documento
          this.grupos.push(decano); // Añade al arreglo de docentes
        });

       
      },
      onFail: (err) => {
        console.error("Error al obtener los docentes:", err);
      },
    });
  }

  getEvento() {
    let i = this.auth.getAuth().currentUser?.uid + "";
    // Consulta directa a la colección "t-users" para filtrar por rol "docente"
    this.firestore.getCollection({
      path: ["eventos"], // Ruta a la colección
      where: [new Where("members", "array-contains", i)
      ], // Filtra usuarios con rol "docente"
      onComplete: (result) => {
        result.docs.forEach((doc) => {
          const decano = doc.data(); // Obtiene los datos del documento
          //docente.userId = doc.id; // Agrega el ID del documento
          this.eventos.push(decano); // Añade al arreglo de docentes
        });

        
      },
      onFail: (err) => {
        console.error("Error al obtener los docentes:", err);
      },
    });
  }


  CrearPost() {
    this.dialog.open(CreatePostComponent);
  }

  getPosts() {
    this.firestore.getCollection({
      path: ["Posts"],
      where: [
        new OrderBy("timestamp", "desc"),
        new Limit(10),
      ],
      onComplete: (result) => {
        result.docs.forEach((doc) => {
          let post = <PostData>doc.data();
          post.id = doc.id; // Agrega el ID del documento al objeto `post`
          this.posts.push(post); // Agrega el post con su ID al arreglo
          //verificar post

        });
      },
      onFail: (err) => {
        console.error("Error al obtener los posts:", err);
      },
    });
  }

  getInfo() {
    let i = this.auth.getAuth().currentUser?.uid;
    this.firestore.getCollection(
      {
        path: ["Users"],
        where: [

        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {


              const u = doc.data(); // Obtén los datos del documento
              //group['id'] = doc.id; // Asigna el ID del documento al grupo
              this.userProfileData.push(u as UserProfile); // Asegúrate de que group se ajuste a la interfaz Grupo

              if (u['userId'] == i) {
                this.name = u['publicName'];
                this.photo = u['photoUrl'];

              }
              this.b = true;



              // doc.data();
              // this.photo = this.userProfileData.photoUrl;
              // this.name = this.userProfileData.publicName;


            }
          )
        },
        onFail: err => {

        }
      }

    );
  }

  sendId(id: string): string {
    // Asigna una cadena vacía si creatorId es undefined
    //comprobar si entramos a nuestro perfil
    if (id == this.auth.getAuth().currentUser?.uid) {
      this.callPerfilClick1();

    } else {
      this.sharedService.sendId(id); // Envía el ID a través del servicio
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
export interface PostData {
  comment: string,
  creatorId: string,
  imageUrl?: string,
  timestamp: any;
  id?: string;
  likes: number;

}
export interface UserProfile {
  publicName: string;
  publicLastname: string;
  userId: string;
  photoUrl: string
  verificado: string
  publicCareer: string

}

