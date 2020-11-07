import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
 
@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {
  @Input() pagerX: any = {};

  searchObject:SearchObject={};

  @Output()
  pagedClicked :EventEmitter<any>=new EventEmitter<any>();


  uploadComplete(pageno:number) {
    debugger;
    this.gridService.currentData.subscribe(x => this.searchObject = x)
    this.searchObject.pageNo=pageno;
    this.pagedClicked.emit(this.searchObject);
 
  }
 
  constructor(private gridService:GridService) { }

  ngOnInit() {}

}
