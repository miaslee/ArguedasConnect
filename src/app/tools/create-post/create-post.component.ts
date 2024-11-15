import { Component } from '@angular/core';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  selectedImageFile: File | null = null;
 

  constructor (){

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
