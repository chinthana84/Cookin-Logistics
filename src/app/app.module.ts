

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

import { LoginModule } from './User/login.module';
import { MenuComponent } from './menu/menu.component';

import { LoginComponent } from './User/login/login.component';

import { HomeComponent } from './User/home/home.component';
import { LoaderService } from './MyServices/loader.service';
import { LoaderInterceptor } from './Myinteceptors/loader.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
import { TutorsTimetableModule } from './tutors-timetable/tutors-timetable.module';
import { VenueComponent } from './Venus-Sessions/venue/venue.component';
import { VenueSessionModule } from './Venus-Sessions/venue-session.module';
import { QuliClassUniModule } from './Quals-Classes-Units/quli-class-uni.module';
import { OrderTotalsModule } from './Order-Totals/order-totals.module';
import { OrderModule } from './Recipess/order.module';
import { PoModule } from './po/po.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './_shared/guard/auth-guard.service';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}


@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent,
    CategoryComponent,
    ProductComponent,
    MenuComponent,
    LoaderComponent,
    VenueComponent


  ],
  imports: [
    BrowserModule,
    CommonModule,

    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'home',data:{titleKey: 'home'}, component: HomeComponent },
      {
        path: 'suppliers',data:{titleKey: 'Supplier'}, component: SuppliersComponent, children: [{ path: 'edit', component: SuppliersComponent }]

      }, {
        path: 'category',data:{titleKey: 'Category'}, component: CategoryComponent, children: [{ path: 'edit', component: SuppliersComponent }]
      }
      , {
        path: 'products',data:{titleKey: 'Product'}, component: ProductComponent, children: [{ path: 'edit', component: ProductComponent }]
      }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      //  whitelistedDomains: ["localhost:5000"],
      //  blacklistedRoutes: []
      }
    }),

    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    OrderModule,
    LoginModule,
    TutorsTimetableModule,
    VenueSessionModule,
    QuliClassUniModule,
    OrderTotalsModule,
    PoModule,
    NgbModule

  ],
  exports:[NgbModule],
  providers: [LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

