import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog"
import { CreatePostComponent } from '../../tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';
import { NgFor } from '@angular/common';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostComponent, NgFor],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();

posts : PostData []=[];



constructor (private dialog : MatDialog){

}
ngOnInit(): void {
  this.getPosts();
 
}


  CrearPost() {
  this.dialog.open(CreatePostComponent);
  }

getPosts (){
this.firestore.getCollection(
{
  path:["Posts"],
  where: [
      new OrderBy("timestamp", "desc"),
      new Limit(10)
  ],
  onComplete: (result) => {
result.docs.forEach(
  doc => {
    let post = <PostData>doc.data();
    this.posts.push(post);
   
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
export interface PostData {
  comment: string,
  creatorId: string,
  imageUrl?: string
}

