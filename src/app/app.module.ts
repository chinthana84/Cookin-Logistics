

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SuppliersComponent } from './MENU1/suppliers/suppliers.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './_shared/Shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from './_shared/confirm-dialog/confirm-dialog.module';
import { CategoryComponent } from './MENU1/category/category.component';
import { ProductComponent } from './MENU1/product/product.component';
 
import { OrderModule } from './ORDER_RELATED/order.module';
import { LoginModule } from './User/login.module';
import { MenuComponent } from './menu/menu.component';

import { LoginComponent } from './User/login/login.component';

import { HomeComponent } from './User/home/home.component';
import { LoaderService } from './MyServices/loader.service';
import { LoaderInterceptor } from './Myinteceptors/loader.interceptor';
import { LoaderComponent } from './loader/loader.component';




@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent,
    CategoryComponent,
    ProductComponent,
    MenuComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    OrderModule,
    LoginModule,

    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'home', component: HomeComponent },
      {
        path: 'suppliers', component: SuppliersComponent, children: [{ path: 'edit', component: SuppliersComponent }]

      }, {
        path: 'category', component: CategoryComponent, children: [{ path: 'edit', component: SuppliersComponent }]
      }
      , {
        path: 'products', component: ProductComponent, children: [{ path: 'edit', component: ProductComponent }]
      }
    ])
  ],
  providers: [LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

