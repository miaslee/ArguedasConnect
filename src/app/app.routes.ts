import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmailverificationComponent } from './pages/emailverification/emailverification.component';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';

export const routes: Routes = [

    {path: "", component: HomeComponent},
    {path:"emailVerification", component: EmailverificationComponent},
    {path: "completeProfile", component: CompleteProfileComponent},
    {path: "**", component: HomeComponent}
    
];
