import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridService } from './_grid/grid-service/grid.service';
import { SearchComponent } from './_grid/search/search.component';
import { FormsModule } from '@angular/forms';
import { PagerComponent } from './_grid/pager/pager.component';
import { ConfirmDialogService } from './_services/ConfirmDialogService';
import {ConfirmMessageComponent} from './confirm-message/confirm-message.component'   
@NgModule({
  declarations: [SearchComponent,PagerComponent   ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[SearchComponent,PagerComponent],
  providers:[GridService,ConfirmDialogService]
})
export class SharedModule { }
