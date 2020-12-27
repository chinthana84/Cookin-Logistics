import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { RefTable } from 'src/app/models/reftable.model';
import { Tutor } from 'src/app/models/tutor.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-ref-table-data',
  templateUrl: './ref-table-data.component.html'
})
export class RefTableDataComponent implements OnInit {
  private subs = new SubSink();
  model: RefTable[] = [];
  modelDistinct: string[] = [];
  selectedValue: string = ""

  constructor(private gridService: GridService,
    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink =   this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllDistinctRefTable`).subscribe(r => {
      this.modelDistinct = r;
      this.selectedValue = ""
    });

  }
  changeWebsite(e) {
    this.selectedValue = e.target.value;
    if (this.selectedValue != "") {
      this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Common/GetRefByName/` + e.target.value)
        .subscribe((data) => {
          this.model = data;
        });
    }
    else{
      this.model=[];
    }
  }

  addRef() {
    let obj = new RefTable();
    obj.RefTableName = this.selectedValue;
    this.model.push(obj)
  }

  saveRef(obj: RefTable) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/common/SaveRef`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Common/GetRefByName/` +obj.RefTableName)
          .subscribe((data) => {
            this.model = data;
          });
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

}
