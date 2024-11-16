import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog"
import { CreatePostComponent } from '../../tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';
import { NgFor, NgIf } from '@angular/common';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Timestamp } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent, NgFor, NgIf],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();

posts : PostData []=[];
photo : string = "";
name: string ="";
b : boolean = false;
p :boolean = false;



public userProfileData: UserProfile | null = null;


constructor (private dialog : MatDialog){
  
}
ngOnInit(): void {
  this.getPosts();
  this.getInfo ();
 
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

getInfo (){
  let i = this.auth.getAuth().currentUser?.uid;
  this.firestore.getCollection(
  {
    path:["Users"],
    where: [
        new Where ("userId","==",i)
    ],
    onComplete: (result) => {
  result.docs.forEach(
    doc => {
      this.b = true;
      this.userProfileData = doc.data() as UserProfile;
      
     // doc.data();
      this.photo = this.userProfileData.photoUrl;
      this.name = this.userProfileData.publicName;
      
     
    }
  )   
    },
    onFail: err => {
      
    }
  }
  
  );
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
  userId : string;
  photoUrl: string
}

