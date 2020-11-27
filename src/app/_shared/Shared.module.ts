import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './_grid/grid-service/grid.service';
import { SearchComponent } from './_grid/search/search.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PagerComponent } from './_grid/pager/pager.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb/bread-crumb.component';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [SearchComponent,PagerComponent, BreadCrumbComponent   ],
  imports: [

    CommonModule,
    FormsModule,ReactiveFormsModule
  ],
  exports:[SearchComponent,PagerComponent,BreadCrumbComponent],
  providers:[GridService]
})
export class SharedModule { }
