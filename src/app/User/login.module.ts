import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../_shared/Shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  {
    path: 'login',  component: LoginComponent
  },
  {
    path: 'changepw',  component: ChangePasswordComponent
  },
  {
    path: 'admin',  component: AdminComponent,
     children: [{ path: 'edit', component: AdminComponent }]
  }
 ];

@NgModule({
  declarations: [ LoginComponent, HomeComponent, AdminComponent, ChangePasswordComponent],
  imports: [
 CommonModule,
    FormsModule,
    //NgbModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
