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

const routes: Routes = [

    { path: '500', component: InternalServerComponent },
    { path: '403', component: InternalServerComponent }
]



@NgModule({
  declarations: [SearchComponent,PagerComponent, BreadCrumbComponent,NumericDirective, InternalServerComponent   ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],

  exports:[SearchComponent,PagerComponent,BreadCrumbComponent,NumericDirective]
  , providers:[GridService]
})
export class SharedModule { }
