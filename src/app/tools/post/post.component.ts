import { Component, Input } from '@angular/core';
import { FirebaseTSFirestore, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostData } from '../../pages/feed/feed.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  @Input() postData?: PostData;
  auth = new FirebaseTSAuth();
 firestore = new FirebaseTSFirestore(); 
 public userProfileData: UserProfile | null = null;
  username: string = "";

  constructor(){
    
  }
  ngOnInit() {
    this.getInfoProfile();
  
  }


  
  getInfoProfile (){
    let userId = this.auth.getAuth().currentUser?.uid;
    
    this.firestore.getCollection(
    {
      path:["Users"],
      where: [
        
      ],
      
      onComplete: (result) => {
    result.docs.forEach(
      doc => {
       
       this.userProfileData = doc.data() as UserProfile;
       if(this.postData?.creatorId == this.userProfileData.userId){
        this.username = this.userProfileData.publicName;
       
       }


       
       
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
  
  userId : string;
}
