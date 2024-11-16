import { Component, Inject } from '@angular/core';
import { FirebaseTSFirestore, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from '../../app.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [NgFor],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css'
})
export class ReplyComponent {
  firestore = new FirebaseTSFirestore();
  auth = new FirebaseTSAuth();
  public userProfileData: UserProfile | null = null;
  comments :Comment [] = [];


  constructor(@Inject(MAT_DIALOG_DATA) private id: string){
    this.getInfoProfile1();
  }
ngOnInit(): void {
  this.getComment();
}

getComment() {
  this.firestore.listenToCollection(
    {
      name:"Post Comments",
      path:["Posts", this.id, "PostComments"],
      where: [
        new OrderBy("timestamp","asc")
      ],
      onUpdate : (result) =>{
        result.docChanges().forEach(
          postComentDoc =>{
            if(postComentDoc.type == "added"){
              this.comments.unshift(<Comment>postComentDoc.doc.data());
            }
          }
        )
      }
    }
  );
}
  getInfoProfile1 (){


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
        
       
      }
    )
      },
      onFail: err => {
        
      }
    }
    
    );
    }
  onSendClick(commentInput:HTMLInputElement) {
   
    let name = this.userProfileData?.publicName;
    let lastname = this.userProfileData?.publicLastname+"";
    let photoUrl = this.userProfileData?.photoUrl;

    if(commentInput.value.length>0){
      this.firestore.create(
  
        {
          path: ["Posts", this.id, "PostComments"],
          data: {
            comment : commentInput.value,
            creatorId : this.auth.getAuth().currentUser?.uid,
            creatorName: name+" "+lastname,
            timestamp : FirebaseTSApp.getFirestoreTimestamp(),
            photoUrl: photoUrl
      
          },
          onComplete: (docId) => {
            commentInput.value = "";
          }
        }
      )

    }

  }


  
}


export interface UserProfile {
  publicName: string
  publicLastname : string,
  photoUrl:  string
}
export interface Comment {
  creatorId: string;
  creatorName: string;
  comment: string;

  timestamp : firebase.default.firestore.Timestamp
  photoUrl:  string
}
