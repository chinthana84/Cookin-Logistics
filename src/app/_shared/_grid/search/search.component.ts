import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';

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
  searchID: number;


  @Output()
  searchClicked: EventEmitter<any> = new EventEmitter<any>();




  searchClick(obj: any, s: string) {
    const x: SearchObject = {
      pageNo: 1,
      searchColName: this.searchColumn,
      searchText: this.searchText
    };

    this.gridService.updateMessage(x);

    this.searchClicked.emit(x);
  }

  constructor(private gridService: GridService) { }

  ngOnInit() {

    this.searchColumn = this.searchOptionsX[0].colName;
  }

}
