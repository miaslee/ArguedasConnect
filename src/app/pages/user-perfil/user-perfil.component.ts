import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PerfilComponent } from '../perfil/perfil.component';
import { PerfilPostsComponent } from '../../tools/perfil-posts/perfil-posts.component';

@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [NgFor,PerfilComponent, PerfilPostsComponent],
  templateUrl: './user-perfil.component.html',
  styleUrl: './user-perfil.component.css'
})
export class UserPerfilComponent {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore(); 
  public userProfileData: UserProfile | null = null;
  posts : PostData []=[];



  ngOnInit(): void {
    const i =  this.auth.getAuth().currentUser?.uid+"";
    this.getPosts (i);
    this.getInfoProfile1(i);
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
