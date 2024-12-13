import { Component, Inject } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { timestamp } from 'rxjs';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-post-create-grupo',
  standalone: true,
  imports: [],
  templateUrl: './post-create-grupo.component.html',
  styleUrl: './post-create-grupo.component.css'
})
export class PostCreateGrupoComponent {

  selectedImageFile: File | null = null;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore;
  p : boolean = false;


  constructor(private dialog: MatDialogRef<PostCreateGrupoComponent >, private sharedService: SharedService, @Inject(MAT_DIALOG_DATA) public grupoId: string) {
   // console.log("id grupo: ",grupoId)

  }

  showNotification(valor: string): string {

    this.sharedService.sendId1(valor); // Envía el ID a través del servicio
    return valor
  }
  loadPost() {
    this.sharedService.triggerPerfilClick3();

  }



   PostClick(commentInput: HTMLTextAreaElement) {
    if(!this.p){
      
      let comment = commentInput.value;
  
      if (comment.length <= 0) return;
      if (this.selectedImageFile) {
        this.uploadImagePost(comment);
       this.p = true;
      } else {
         this.uploadPost(comment);
         this.p = true;
      }
    }
    
   

  }
  async uploadImagePost(comment: string) {
    let postID = this.firestore.genDocId();

    if (this.selectedImageFile) { // Verifica si selectedImageFile no es null
      this.showNotification("post-creando");
      const uploadedUrl = await this.uploadToDevmias(this.selectedImageFile);
      //console.log('URL de la imagen subida:', uploadedUrl);
      this.firestore.create(
        {
          path: [`grupos/${this.grupoId}/publicaciones`],
          data: {
            id: '',
             groupId:   this.grupoId,
            autor: this.auth.getAuth().currentUser?.uid,
            imageUrl: uploadedUrl,
            contenido: comment,
            tipo: "texto",
            fecha: new Date(),
          },
          onComplete: (docId) => {
            this.loadPost()
            this.dialog.close();
            this.showNotification("post-creado");
            this.p = false;


          }

        }

      );

    } else {
      console.error("No se ha seleccionado un archivo.");
    }

  }
  uploadPost(comment: string) {
    this.showNotification("post-creando")
    this.firestore.create(
      {
        path: [`grupos/${this.grupoId}/publicaciones`],
        data: {
          id: '',
          groupId:   this.grupoId,
         autor: this.auth.getAuth().currentUser?.uid,
       
         contenido: comment,
         tipo: "texto",
         fecha: new Date(),
        },
        onComplete: (docId) => {
          this.loadPost()
          this.dialog.close();
          this.showNotification("post-creado");
          this.p = false;
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

  isImage(r: boolean) {
    return r;
  }


}
