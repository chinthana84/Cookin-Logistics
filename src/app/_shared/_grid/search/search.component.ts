import { TypeheadService } from './../../_services/typehead.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { GridOptions } from '../gridModels/gridOption.model';
import { Grid } from '../gridModels/grid.model';
import { Observable, of } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { TypeHeadSearchDTO } from 'src/app/models/typeheadSearchDTO.model';

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


  public model: any;
  public searching = false;
  public searchFailed = false;
  public formatter = (x: TypeHeadSearchDTO) => x.Name
  public formatterx = (x: TypeHeadSearchDTO) => x.Name;
  public returnList:TypeHeadSearchDTO[]=[];



  searchClick(obj: any, s: string) {

    // if(this.model.Name == undefined){
    //   this.searchText=this.model;
    // }
    // else{
    //   this.searchText=this.model.Name;
    // }

debugger
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

  getSearchObject(obj: any, s: string){
    if(this.model.Name == undefined){
      this.searchText=this.model;
    }
    else{
      this.searchText=this.model.Name;
    }

debugger
    const x: SearchObject = {
      pageNo: 1,
      searchColName: obj ,//this.searchColumn,
     searchText: this.searchText,
      defaultSortColumnName:this.search.defaultSortColumnName,
      girdId:this.search.girdId
    };

return x;
  }

  constructor(private gridService: GridService,private typeheadService :TypeheadService) { }

  ngOnInit() {

     this.searchColumn = this.search.colNames[0].colName;
  }


  searchItems  = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    filter(r => r.length > 3),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(term =>

      this.gridService.getGridDataTypehead(this.getSearchObject(this.searchColumn,this.searchText))
      //this.typeheadService.TypeHeadSearch(term, 1)
.pipe(map(r=>{
  debugger
  console.log(r.pagedItems)
this.returnList=[];
  r.pagedItems.forEach(element => {
    debugger
    let obj=new TypeHeadSearchDTO();
    obj.ID=element.ProductId;
    obj.Name=element.ProductName;
    this.returnList.push(obj);
  });

debugger

  return this.returnList;
}))
        .pipe(


          tap(() => {
            this.searchFailed = false;
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
    ),
    tap(() => this.searching = false)
  )


}
