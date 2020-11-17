import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { GridOptions } from '../gridModels/gridOption.model';

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
  search :any={}

  @Input()
  searchID: number;


  @Output()
  searchClicked: EventEmitter<any> = new EventEmitter<any>();


  getPropertNames(){

  return Object.keys(this.search);
  }


  searchClick(obj: any, s: string) {



    const x: SearchObject = {
      pageNo: 1,
      searchColName: obj ,//this.searchColumn,
      searchText: this.searchText,

    };

    this.gridService.updateMessage(x);

    this.searchClicked.emit(x);
  }

  constructor(private gridService: GridService) { }

  ngOnInit() {

    console.log(Object.keys(this.search))
     this.searchColumn = this.getPropertNames()[0];
  }

}
