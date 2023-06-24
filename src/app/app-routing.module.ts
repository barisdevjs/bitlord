import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [ 
  { path: '', component: HomeComponent },
  // { path: '', component: LOGIN },
  { path: 'profile',  component : ProfileComponent }, 
  { path: 'login',  component : LoginComponent }, 

  // { path: 'calendar', component : CalendarComponent, canActivate:[AuthGuard] },
  // { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
