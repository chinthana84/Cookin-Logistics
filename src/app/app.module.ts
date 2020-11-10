import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SuppliersComponent } from './MENU1/suppliers/suppliers.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './_shared/Shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from './_shared/confirm-dialog/confirm-dialog.module';
import { CategoryComponent } from './MENU1/category/category/category.component'; 
@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent,
    CategoryComponent 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,

    FormsModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
     RouterModule.forRoot([
      {
         path: 'suppliers',  component: SuppliersComponent,  children:[{path:'edit',component:SuppliersComponent}]

      },{
        path: 'category',  component: CategoryComponent,  children:[{path:'edit',component:SuppliersComponent}]
      }
   ])
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
 
 