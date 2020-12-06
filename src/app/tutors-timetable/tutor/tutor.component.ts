import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { Tutor } from 'src/app/models/tutor.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit,OnDestroy {
  private subs = new SubSink();
  edited: boolean = false;
  model: Tutor = {};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Tutor
      , defaultSortColumnName: "TutorId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "FirstName", colText: ' FirstName' },
      { colName: "LastName", colText: 'LastName' }
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

  this.subs.sink=  this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new Tutor();
      } else if (params.id > 0) {
        this.edited = true;
        this.subs.sink=    this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetTutorByID/` + params.id)
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
    this.subs.sink=   this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: Tutor) {
    if (obj == undefined) {
      this.router.navigate(['/tutor/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/tutor/edit'], { queryParams: { id: obj.TutorId } });
    }
    this.edited = true
  }

  onSubmit(obj: Tutor) {

    this.subs.sink=   this.http
      .post<any>(`${environment.APIEndpoint}/common/SaveTutor`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['tutor']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

}
