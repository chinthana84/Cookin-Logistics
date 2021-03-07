import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../_shared/Shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RefTableDataComponent } from './ref-table-data/ref-table-data.component';
import { FirstMondayComponent } from './first-monday/first-monday.component';



const routes: Routes = [
  {
    path: 'login',  component: LoginComponent
  },
  {
    path: 'changepw',data:{titleKey: 'Change Password'},  component: ChangePasswordComponent
  },
  {
    path: 'admin',data:{titleKey: 'Admin'},  component: AdminComponent,
     children: [{ path: 'edit', component: AdminComponent }]
  },
  {
    path: 'ref',data:{titleKey: 'Reference Data'},  component: RefTableDataComponent
  }
  ,
  {
    path: 'first',data:{titleKey: 'Working Year'},  component: FirstMondayComponent
  }
 ];

@NgModule({
  declarations: [ LoginComponent, HomeComponent, AdminComponent, ChangePasswordComponent, RefTableDataComponent, FirstMondayComponent],
  imports: [
 CommonModule,
    FormsModule,

     SharedModule,

    RouterModule.forChild(routes),
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
