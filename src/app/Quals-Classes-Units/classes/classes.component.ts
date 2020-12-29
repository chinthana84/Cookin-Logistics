import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Class } from 'src/app/models/ClassDTO';
import { GridType } from 'src/app/models/gridType.enum';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html'
})

export class ClassesComponent implements OnInit {

  edited: boolean = false;
  model: Class ={};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Class
      , defaultSortColumnName: "ClassId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "ClassCode", colText: 'ClassCode' },
      { colName: "Name", colText: 'Name' }
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


  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new Class();
      } else if (params.id > 0) {
        this.edited = true;
        this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetClassesByID/` + params.id)
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
    this.gridService.getGridData(obj).subscribe((data) => {
      console.log(data)
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }


  Action(obj: Class) {
    if (obj == undefined) {
      this.router.navigate(['/classes/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/classes/edit'], { queryParams: { id: obj.ClassId } });
    }
    this.edited = true
  }

  getMinHrRequired():string{
    let n=this.model.ClassMinAttend/this.model.ClassContactHrs;

    if (n==undefined){
      return "0";
    }
    else{
      return n.toFixed(2);
    }
  }

  onSubmit(obj: Class) {

      this.http
      .post<any>(`${environment.APIEndpoint}/common/SaveClasses`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['classes']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

}
