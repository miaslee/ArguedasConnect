import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmailverificationComponent } from './pages/emailverification/emailverification.component';

export const routes: Routes = [

    {path: "", component: HomeComponent},
    {path:"emailVerification", component: EmailverificationComponent},
    {path: "**", component: HomeComponent}
    
];
