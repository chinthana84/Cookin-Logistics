import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: 'login',  component: LoginComponent
  }
 ];

@NgModule({
  declarations: [ LoginComponent, HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    //NgbModule,
    RouterModule.forChild(routes),
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
