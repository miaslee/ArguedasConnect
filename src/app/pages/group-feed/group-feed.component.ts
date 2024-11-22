import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Grupo } from '../grupos/grupos.component';
import { MatDialog } from '@angular/material/dialog';
import { PostCreateGrupoComponent } from '../../tools/post-create-grupo/post-create-grupo.component';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-group-feed',
  standalone: true,
  imports: [CommonModule,
    FormsModule, NgIf],
  templateUrl: './group-feed.component.html',
  styleUrl: './group-feed.component.css'
})
export class GroupFeedComponent {
  @Input() group!: Grupo; // Grupo recibido como input
  publicaciones : Publicacion[] = [];
  firestore: FirebaseTSFirestore = new FirebaseTSFirestore();
  auth: FirebaseTSAuth = new FirebaseTSAuth();
  verificado: boolean =true;
  constructor(private dialog : MatDialog, private sharedService: SharedService) {

  }

  // Define explícitamente el tipo como un arreglo de objetos

  newPost: Partial<Publicacion> = {
    contenido: '',
    tipo: 'texto',
  };



  ngOnInit(): void {
    this.loadFeed();
    this.sharedService.perfilClick3$.subscribe(() => {
      this.loadFeed(); // Llama a perfilClick cuando el evento se activa
     
    });
  }



  loadFeed() { 
    this.firestore.getCollection({
      path: [`grupos/${this.group.id}/publicaciones`],
      where: [new OrderBy("fecha", "desc")],
      onComplete: (result) => {
        const publicacionesTemp: Publicacion[] = [];
        
        result.docs.forEach((doc) => {
          const data = doc.data();
          const publicacion: Publicacion = {
            id: doc.id,
            groupId: this.group.id,
            imageUrl:  data['imageUrl'],
            autor: data['autor'],
            contenido: data['contenido'],
            tipo: data['tipo'],
            fecha: data['fecha'].toDate(),
            autorNombreCompleto: "" // Campo inicializado vacío
          };

          // Validar que autor tenga un valor válido
          if (publicacion.autor) {
            const autorPath = `Users/${publicacion.autor}`;
            
            this.publicaciones = [...publicacionesTemp]; // Actualiza las publicaciones
            this.firestore.getDocument({
              path: ["Users", publicacion.autor ],
              onComplete: (userDoc) => {
                const userData = userDoc.data();
                if (userData) {
                  publicacion.autorNombreCompleto = `${userData['publicName']} ${userData['publicLastname']}`;
                  publicacion.fotoUsuario = userData['photoUrl'];
                  publicacion.carrera = userData['publicCareer'];
                  publicacion.verificado = userData['verificado'];
                  
                  if(publicacion.verificado == "true"){
                    this.verificado =true;
                  }
                  if(publicacion.verificado == "false"){
                    this.verificado =false;
                  }
                  
                 


                } else {
                  publicacion.autorNombreCompleto = "Usuario desconocido";
                }
                publicacionesTemp.push(publicacion);
                this.publicaciones = [...publicacionesTemp]; // Actualiza las publicaciones
              },
              onFail: (err) => {
                console.error("Error al obtener los datos del autor:", err);
                publicacion.autorNombreCompleto = "Usuario desconocido";
                publicacionesTemp.push(publicacion);
                this.publicaciones = [...publicacionesTemp]; // Actualiza las publicaciones
              }
            });
          } else {
            console.error("ID de autor inválido o vacío.");
            publicacion.autorNombreCompleto = "Usuario desconocido";
            publicacionesTemp.push(publicacion);
          }
        });

        this.publicaciones = [...publicacionesTemp]; // Actualiza las publicaciones
      },
      onFail: (error) => {
        console.error("Error al cargar el feed:", error);
      }
    });
}

  
  addPost(){
    const grupoId = this.group.id
    console.log("gupo Id:",grupoId)
    this.dialog.open(PostCreateGrupoComponent, {
      data :  grupoId
    });
  }

  sendId(id:string): string {
    //const id = this.publicaciones[0]?.autor // Asigna una cadena vacía si creatorId es undefined
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





export interface Publicacion {
  id: string;
  groupId: string;
  autor: string;
  contenido: string;
  tipo: string;
  fecha: Date;
  imageUrl:string;
  autorNombreCompleto?: string;
  fotoUsuario?: string;
  carrera?: string
  verificado? : string;
  img?: string;
}


