import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { GridOptions } from '../gridModels/gridOption.model';
import { Grid } from '../gridModels/grid.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  dropDonwDefautlSelected = 1;

  searchColumn = '';
  searchText = '';

  @Input()
  searchOptionsX: any = {};

  @Input()
  search :SearchObject={}

  @Input()
  searchID: number;


  @Output()
  searchClicked: EventEmitter<any> = new EventEmitter<any>();





  searchClick(obj: any, s: string) {



    const x: SearchObject = {
      pageNo: 1,
      searchColName: obj ,//this.searchColumn,
      searchText: this.searchText,
      defaultSortColumnName:this.search.defaultSortColumnName,
      girdId:this.search.girdId

    };

    this.gridService.updateMessage(x);

    this.searchClicked.emit(x);
  }

  constructor(private gridService: GridService) { }

  ngOnInit() {

     this.searchColumn = this.search.colNames[0].colName;
  }

}
