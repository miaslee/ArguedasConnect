import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ɵgetUnknownPropertyStrictMode } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { PerfilPostsComponent } from '../../tools/perfil-posts/perfil-posts.component';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf,PostComponent, NgFor, PerfilPostsComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
 auth = new FirebaseTSAuth();
 firestore = new FirebaseTSFirestore(); 
 public userProfileData: UserProfile | null = null;
 posts : PostData []=[];
 

 constructor(){
  this.getInfoProfile();
  
 }
 ngOnInit(): void {
  this.getPosts();
 
}

  getPosts (){
    let userId = this.auth.getAuth().currentUser?.uid;
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
        this.posts.push(post);
       
      }
    )
    
        
      },
      onFail: err => {
        
      }
    }
    
    );
    }

 

  getInfoProfile (){
    let userId = this.auth.getAuth().currentUser?.uid;
    
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
  publicCareer: string;
  publicFN: string;
  publicLastname: string;
  publicSex: string;
}
export interface PostData {
  comment: string,
  creatorId: string,
  imageUrl?: string,
  timestamp : any
}




