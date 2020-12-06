import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Categories } from 'src/app/models/categories.model';
import { GridType } from 'src/app/models/gridType.enum';
import { IMyGrid } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, IMyGrid,OnDestroy {
  edited: boolean = false;
  private subs = new SubSink();
  model: Categories = {};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Category
      , defaultSortColumnName: "CategoryId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CategoryName", colText: ' Name' },
      { colName: "Description", colText: 'Description' }
      ]
    }
  };


  constructor(private gridService: GridService,

    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.edited = false
  }
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink =  this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new Categories();
      } else if (params.id > 0) {
        this.edited = true;
        this.subs.sink =  this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetCategoryByID/` + params.id)
          .subscribe((data) => {
            this.model = data;
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink =    this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: Categories) {
    if (obj == undefined) {
      this.router.navigate(['/category/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/category/edit'], { queryParams: { id: obj.CategoryId } });
    }
    this.edited = true
  }

  onSubmit(obj: Categories) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Category`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['category']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

}
