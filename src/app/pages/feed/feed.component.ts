import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog"
import { CreatePostComponent } from '../../tools/create-post/create-post.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
constructor (private dialog : MatDialog){

}


  CrearPost() {
  this.dialog.open(CreatePostComponent);
  }

}
