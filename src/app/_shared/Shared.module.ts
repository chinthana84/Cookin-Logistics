import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './_grid/grid-service/grid.service';
import { SearchComponent } from './_grid/search/search.component';
import { FormsModule } from '@angular/forms';
import { PagerComponent } from './_grid/pager/pager.component';

  
@NgModule({
  declarations: [SearchComponent,PagerComponent   ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[SearchComponent,PagerComponent],
  providers:[GridService]
})
export class SharedModule { }
