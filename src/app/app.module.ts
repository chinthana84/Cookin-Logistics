import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SuppliersComponent } from './MENU1/suppliers/suppliers.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './_shared/Shared.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ToastrModule.forRoot(),
     RouterModule.forRoot([
      {
         path: 'suppliers',  component: SuppliersComponent,
         children:[
           {path:'edit',component:SuppliersComponent}
         ]
      }
   ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

 