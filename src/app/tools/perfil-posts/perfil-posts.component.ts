import { Component, Input } from '@angular/core';
import { PostData } from '../../pages/perfil/perfil.component';



@Component({
  selector: 'app-perfil-posts',
  standalone: true,
  imports: [],
  templateUrl: './perfil-posts.component.html',
  styleUrl: './perfil-posts.component.css'
})
export class PerfilPostsComponent {

  @Input() postData?: PostData;

  constructor(){
    console.log(this.postData)
  }
  





    
  
}

