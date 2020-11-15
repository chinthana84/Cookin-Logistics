

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
import { CategoryComponent } from './MENU1/category/category.component';
import { ProductComponent } from './MENU1/product/product.component';
import { CommonModule } from '@angular/common';
import { OrderModule } from './ORDER_RELATED/order.module';


@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent,
    CategoryComponent,
    ProductComponent
  ],
  imports: [


    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    OrderModule,
     RouterModule.forRoot([
      {
         path: 'suppliers',  component: SuppliersComponent,  children:[{path:'edit',component:SuppliersComponent}]

      },{
        path: 'category',  component: CategoryComponent,  children:[{path:'edit',component:SuppliersComponent}]
      }
      ,{
        path: 'products',  component: ProductComponent,  children:[{path:'edit',component:ProductComponent}]
      }
      
   ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

