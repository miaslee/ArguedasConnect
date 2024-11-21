import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { Grupo } from '../grupos/grupos.component';


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
  verificado1: boolean =false;

  // Define explícitamente el tipo como un arreglo de objetos

  newPost: Partial<Publicacion> = {
    contenido: '',
    tipo: 'texto',
  };



  ngOnInit(): void {
    this.loadFeed();
    console.log("Grupo recibido:", this.group); // Debugging
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
            autor: data['autor'],
            contenido: data['contenido'],
            tipo: data['tipo'],
            fecha: data['fecha'].toDate(),
            autorNombreCompleto: "" // Campo inicializado vacío
          };

          // Validar que autor tenga un valor válido
          if (publicacion.autor) {
            const autorPath = `Users/${publicacion.autor}`;
            console.log(`Path del documento del autor: ${autorPath}`);
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
                  if(userData['verificado'] == "true"){
                    this.verificado1 =true;
                  }
                  if(userData['verificado'] == "false"){
                    this.verificado1 =false;
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

  addPost() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (!userId || !this.newPost.contenido) {
      alert('No puedes publicar contenido vacío.');
      return;
    }

    const publicacion: Publicacion = {
      id: '',
      autor: userId,
      groupId: this.group.id,
      contenido: this.newPost.contenido!,
      tipo: this.newPost.tipo!,
      fecha: new Date(),
    };

    this.firestore.create({
      path: [`grupos/${this.group.id}/publicaciones`],
      data: publicacion,
      onComplete: () => {
        alert('Publicación agregada.');
        this.newPost.contenido = ''; // Limpia el formulario
        this.loadFeed(); // Recarga el feed
      },
      onFail: (error) => {
        console.error('Error al agregar la publicación:', error);
      }
    });
  }
}





export interface Publicacion {
  id: string;
  groupId: string;
  autor: string;
  contenido: string;
  tipo: string;
  fecha: Date;
  autorNombreCompleto?: string;
  fotoUsuario?: string;
  carrera?: string
  verificado? : boolean;
  img?: string;
}


