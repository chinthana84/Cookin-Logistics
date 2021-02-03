import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './_grid/grid-service/grid.service';
import { SearchComponent } from './_grid/search/search.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PagerComponent } from './_grid/pager/pager.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb/bread-crumb.component';
import { BrowserModule } from '@angular/platform-browser';
import { NumericDirective } from './directive/numeric.directive';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonViewerComponent } from './_grid/common-viewer/common-viewer.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MyproductServiceService } from './product-dialog/myproduct-service.service';

const routes: Routes = [
  { path:'common', component: CommonViewerComponent },
    { path: '500', component: InternalServerComponent },
    { path: '403', component: InternalServerComponent }
]



@NgModule({
  declarations: [SearchComponent,PagerComponent, BreadCrumbComponent,
    NumericDirective, InternalServerComponent, CommonViewerComponent,
    ProductDialogComponent   ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],

  exports:[SearchComponent,PagerComponent,BreadCrumbComponent,NumericDirective
  ,ProductDialogComponent]
  , providers:[GridService,MyproductServiceService]
})
export class SharedModule { }
