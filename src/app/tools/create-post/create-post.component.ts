import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { timestamp } from 'rxjs';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  selectedImageFile: File | null = null;
 auth = new FirebaseTSAuth();
 firestore = new FirebaseTSFirestore;


  constructor (private dialog :MatDialogRef<CreatePostComponent>){

  }
 

  


  PostClick(commentInput : HTMLTextAreaElement){ 
  let comment = commentInput.value;
  
 if(comment.length <= 0) return;
 if(this.selectedImageFile){
  this.uploadImagePost(comment);
 }else{
  this.uploadPost(comment);
 }

  }


  async uploadImagePost (comment: string){
    let postID = this.firestore.genDocId();

  if (this.selectedImageFile) { // Verifica si selectedImageFile no es null
    const uploadedUrl = await this.uploadToDevmias(this.selectedImageFile);
    console.log('URL de la imagen subida:', uploadedUrl);
    this.firestore.create (
      {
        path: ["Posts", postID] ,
        data: {
          comment: comment,
          creatorId: this.auth.getAuth().currentUser?.uid,
          imageUrl: uploadedUrl,
          timestamp : FirebaseTSApp.getFirestoreTimestamp( )
        },
        onComplete: (docId) =>{
    this.dialog.close();
        }
    
      }
    
          );

  } else {
    console.error("No se ha seleccionado un archivo.");
  }

  }
  uploadPost(comment: string){
    this.firestore.create (
      {
        path: ["Posts"] ,
        data: {
          comment: comment,
          creatorId: this.auth.getAuth().currentUser?.uid,
          timestamp : FirebaseTSApp.getFirestoreTimestamp( )
        },
        onComplete: (docId) =>{
    this.dialog.close();
        }
    
      }
    
          );

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


  onPhotoSelected(photoSelector: HTMLInputElement) {
  
    // Verificar si hay un archivo seleccionado
    if (photoSelector.files?.length) {
      this.selectedImageFile = photoSelector.files[0];
      
  
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);
      fileReader.onload = () => {
        const postPreviewImage = document.getElementById("post-preview-image") as HTMLImageElement;
        this.isImage(true);
        
        if (postPreviewImage && fileReader.result) {
          
          postPreviewImage.src = fileReader.result.toString();
          
        }
      };
    } else {
      this.selectedImageFile = null; // O undefined, según tu preferencia
    }
  }
  isImage(r :boolean){
    return r;
  }
  

}


