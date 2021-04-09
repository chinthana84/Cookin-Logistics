import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { GridType } from 'src/app/models/gridType.enum';
import { RefTable } from 'src/app/models/reftable.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-first-monday',
  templateUrl: './first-monday.component.html'
})
export class FirstMondayComponent implements OnInit {
  parseDate(dateString: string): Date {
    if (dateString) {
        return new Date(dateString);
    }
    return null;
}

  private subs = new SubSink();

  constructor(private gridService: GridService,
    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.WorkingYear
      , defaultSortColumnName: "Description",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "FirstMondayDate", colText: 'FirstMondayDate' },{ colName: "Description", colText: 'Description' }
      ]
    }
  };

  setPage(obj: SearchObject): void {
    this.subs.sink = this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;

    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

  }

  Action(obj:any){
    this.gridOption.datas.pagedItems.push(new FirstMonday())
  }


  save(obj:FirstMonday){
    this.subs.sink=   this.http
    .post<any>(`${environment.APIEndpoint}/Common/SaveWorkingYear`, obj, {})
    .subscribe((data) => {
      if (data.IsValid == false) {
        this.confirmDialogService.messageListBox(data.ValidationMessages)
      }
      else {
        this.toastr.success(environment.dataSaved);
        this.router.navigate(['first']);
        this.setPage(this.gridOption.searchObject);

      }
    }, (error) => {

      this.confirmDialogService.messageBox(environment.APIerror)
    });

  }




}
