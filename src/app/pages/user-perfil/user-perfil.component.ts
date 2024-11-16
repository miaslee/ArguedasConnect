import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PerfilComponent } from '../perfil/perfil.component';
import { PerfilPostsComponent } from '../../tools/perfil-posts/perfil-posts.component';

@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [NgFor,PerfilComponent, PerfilPostsComponent, NgIf],
  templateUrl: './user-perfil.component.html',
  styleUrl: './user-perfil.component.css'
})
export class UserPerfilComponent {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore(); 
  public userProfileData: UserProfile | null = null;
  posts : PostData []=[];
  b :boolean =  false;
  selectedImageFile: File | null = null;
  bb : boolean = false;



  ngOnInit(): void {
    const i =  this.auth.getAuth().currentUser?.uid+"";
    this.getPosts (i);
    this.getInfoProfile1(i);
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
  
    // Verificar si hay un archivo seleccionado
    if (photoSelector.files?.length) {
      this.selectedImageFile = photoSelector.files[0];
      
  
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.onload = () => {
        const postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement;
        
        
        if (postPreviewImage && fileReader.result) {
          
          postPreviewImage.src = fileReader.result.toString();
          this.bb = true;
          
        }
      };
    } else {
      this.selectedImageFile = null; // O undefined, según tu preferencia
    }
  }

  async uploadPhoto() {
    if (this.selectedImageFile) {
      let id  =  this.auth.getAuth().currentUser?.uid+"";
      const uploadedUrl = await this.uploadToDevmias(this.selectedImageFile);
     
   
       this.firestore.update({
         path: ["Users", id], // Ruta al documento que deseas actualizar
         data: {
           photoUrl: uploadedUrl
         }, // Campos adicionales o modificados
         onComplete: () => {
           
         },
         onFail: (error) => {
           console.error("Error al actualizar el documento:", error);
         },
       });
    }
   

  }
 

  async uploadToDevmias(selectedImageFile: File): Promise<string | undefined> {
    let url: string | undefined;

    try {
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', selectedImageFile);

      // URL del archivo PHP
      const serverUrl = 'https://devmiasx.com/upload.php'; // Cambia esto por la URL donde está tu archivo PHP

      // Realizar la solicitud POST
      const response = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
      });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // Parsear la respuesta
      const responseData = await response.json();

      if (responseData.success) {
        url = "https://devmiasx.com/" + responseData.url;
      } else {
        throw new Error(responseData.message || 'Error desconocido al subir la imagen.');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }

    return url;
  }


  getPosts (userId: string){
    //let userId = this.auth.getAuth().currentUser?.uid;
    this.firestore.getCollection(
    {
      path:["Posts"],
      where: [
          new Where("creatorId", "==",userId),
          new OrderBy("timestamp", "desc")
      ],
      onComplete: (result) => {
    result.docs.forEach(
      doc => {
        let post = <PostData>doc.data();
        post.id = doc.id; // Agrega el ID del documento al objeto `post`
        this.posts.push(post);
       
      }
    )  
      },
      onFail: err => {
        
      }
    }
    
    );
    }



  getInfoProfile1 (userId: string){
    
    
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
        this.b = true;
       
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
  photoUrl : string;
}
export interface PostData {
  comment: string,
  creatorId: string,
  imageUrl?: string,
  timestamp : any,
  photoUrl :string
  likes: number;
  id?: string; 
}
