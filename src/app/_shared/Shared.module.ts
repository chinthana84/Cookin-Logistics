import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './_grid/grid-service/grid.service';
import { SearchComponent } from './_grid/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerComponent } from './_grid/pager/pager.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb/bread-crumb.component';
import { BrowserModule } from '@angular/platform-browser';
import { NumericDirective } from './directive/numeric.directive';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonViewerComponent } from './_grid/common-viewer/common-viewer.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MyproductServiceService } from './product-dialog/myproduct-service.service';
import { ProductPoDialogComponent } from './product-po-dialog/product-po-dialog.component';
import { ProductPoDialogService } from './product-po-dialog/product-po-dialog.service';
import { AuthGuard } from './guard/auth-guard.service';
import { JwtModule } from "@auth0/angular-jwt";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisableButtonAfterClickDirective } from './directive/disableafterclick.directive';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';

const routes: Routes = [
  { path: 'common', component: CommonViewerComponent },
  { path: '500', component: InternalServerComponent },
  { path: '403', component: InternalServerComponent }
]

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [SearchComponent, PagerComponent, BreadCrumbComponent,
    NumericDirective, InternalServerComponent, CommonViewerComponent,
    ProductDialogComponent,
    ProductPoDialogComponent, ProductPoDialogComponent,DisableButtonAfterClickDirective],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PreventDoubleSubmitModule.forRoot()
  ],
  exports: [SearchComponent, PagerComponent, BreadCrumbComponent, NumericDirective
    , ProductDialogComponent, ProductPoDialogComponent,DisableButtonAfterClickDirective]
  , providers: [GridService, MyproductServiceService, ProductPoDialogService]
})
export class SharedModule { }
