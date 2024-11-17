import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ɵgetUnknownPropertyStrictMode } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { PostComponent } from '../../tools/post/post.component';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { PerfilPostsComponent } from '../../tools/perfil-posts/perfil-posts.component';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, PostComponent, NgFor, PerfilPostsComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  public userProfileData: UserProfile | null = null;
  posts: PostData[] = [];
  receivedId: string | null = null; // Variable para almacenar el ID recibido
  b: boolean = false;
  p: boolean = true;



  constructor(private sharedService: SharedService) {

    this.sharedService.currentId$.subscribe(id => {
      if (id) {
        this.receivedId = id;
        

        this.getInfoProfile1(id);
        this.getPosts(id);
      }
    });

  }
  ngOnInit(): void {
    const i = this.auth.getAuth().currentUser?.uid + "";

  }


  getPosts(userId: string) {
    //let userId = this.auth.getAuth().currentUser?.uid;
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new Where("creatorId", "==", userId),
          new OrderBy("timestamp", "desc")
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data();
              post.id = doc.id; // Agrega el ID del documento al objeto `post`
              this.posts.push(post);

            }
          )
        },
        onFail: err => {

        }
      }
    );
  }
  getInfoProfile1(userId: string) {


    this.firestore.getCollection(
      {
        path: ["Users"],
        where: [
          new Where("userId", "==", userId)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {

              this.userProfileData = doc.data() as UserProfile;

              if (this.userProfileData.privacidad == "privado") {
                this.p = false;
              }
              if (this.userProfileData.privacidad == "publico") {
                this.p = true;
                this.b = true;
              }

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
  photoUrl: string;
  privacidad: string
}
export interface PostData {
  comment: string,
  creatorId: string,
  imageUrl?: string,
  timestamp: any,
  likes: number;
  id?: string;

}




