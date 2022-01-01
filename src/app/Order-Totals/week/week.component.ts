
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { VwWeekGridDTO } from 'src/app/models/Grid/grid.model';
import { RequitioinStatisticWrapper } from 'src/app/models/requ-statitics.model';

import { RequistionSummary } from 'src/app/models/RequisitionSummary.model';
import { GetWeekDaysDTO, Weeks } from 'src/app/models/weeks.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';

import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html'
})
export class WeekComponent implements OnInit {
  private subs = new SubSink();
  firstMondayList :FirstMonday[]=[];
  weekList:Weeks[]=[];
  model: RequistionSummary[] = [];
  modelWrapper: Wrapper = {};
  gridmodel: VwWeekGridDTO = {};
  summaryWrapper :RequitioinStatisticWrapper={};
  weekDays :GetWeekDaysDTO[]=[];

  selectedYear:number=0;
  selectedWeekID:number=0;

  constructor( private gridService: GridService,
    private commonService: CommonService,
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    let a = this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllMondays`);
    let b = this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllWeeks`)

    this.subs.sink =      forkJoin([a,b]).subscribe(results => {
      this.firstMondayList = results[0]
      this.weekList = results[1];
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

    if (params.selectedYear > 0) {

      let c = this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllReftsForRequisitionSummary`);
      let d = this.http.get<any>(`${environment.APIEndpoint}/Common/getWeeksData/${params.selectedYear}/${params.selectedWeek}` )
      let e = this.http.get<any>(`${environment.APIEndpoint}/Common/GetWeekDays/${params.selectedYear}/${params.selectedWeek}` )
      let f = this.http.get<any>(`${environment.APIEndpoint}/Common/GetRequitionStatistics/${params.selectedYear}/${params.selectedWeek}` )
      this.subs.sink =      forkJoin([c,d,e,f]).subscribe(results => {
        this.modelWrapper=results[0];
        this.model = results[1];
        this.weekDays= results[2];
        this.summaryWrapper=results[3];
       this.selectedWeekID =params.selectedWeek;
       this.selectedYear =params.selectedYear;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });



      } else {


      }
    });
  }

  getWeeksData(){
    this.router.navigate(['/Search/'],
     { queryParams: { selectedYear: this.selectedYear,selectedWeek:this.selectedWeekID} });

  }

  AddNewLine(objx: RequistionSummary){
    var obj = new RequistionSummary();
    obj.guid=this.commonService.newGuid();
    this.model.push(obj);
  }

  saveLine(obj: RequistionSummary){
    obj.FirstMondayId=this.selectedYear;
    obj.WeekId=this.selectedWeekID;

    this.subs.sink=   this.http
        .post<any>(`${environment.APIEndpoint}/common/SaveRequisition`, obj, {})
        .subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            location.reload()

          }
        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });
  }


  saveALLLine(){


    this.subs.sink=   this.http
        .post<any>(`${environment.APIEndpoint}/common/saveALLLine`, this.model, {})
        .subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            location.reload()

          }
        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });
  }

  deleteLine(obj:RequistionSummary){

    if (obj.ReqSumEntryId > 0){


      this.confirmDialogService.confirmThis("Are you sure to delete?", ()=>{
        obj.IsDeleted=true;
        this.subs.sink=   this.http
        .post<any>(`${environment.APIEndpoint}/common/SaveRequisition`, obj, {})
        .subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            location.reload();
          }
        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });
      },
      function () { })


    }

    else  {
      this.model = this.model.filter(item => item.guid != obj.guid);
      return;
    }




  }

  deleteAllLine(){

    this.model = this.model.filter(item => item.ReqSumEntryId != 0);

    this.confirmDialogService.confirmThis("Are you sure to delete?", ()=>{

      this.subs.sink=   this.http
      .post<any>(`${environment.APIEndpoint}/common/DeleteAllRequisition`, this.model, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          location.reload();
        }
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
    },
    function () { })


  }


  copyWeekID:number;
  copyYearID:number;

  Copy(){
    debugger
    this.copyWeekID=this.selectedWeekID;
    this.copyYearID=this.selectedYear;
  }

  Paste(){

    if(this.model.length>0){
      this.confirmDialogService.messageBox("to work on copy/paste , need to delete all the current records.")
      return;
    }

    debugger
    let c = this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllReftsForRequisitionSummary`);
    let d = this.http.get<any>(`${environment.APIEndpoint}/Common/getWeeksData/${this.copyYearID}/${this.copyWeekID}` )
    let e = this.http.get<any>(`${environment.APIEndpoint}/Common/GetWeekDays/${this.selectedYear}/${this.selectedWeekID}` )
    let f = this.http.get<any>(`${environment.APIEndpoint}/Common/GetRequitionStatistics/${this.copyYearID}/${this.copyWeekID}` )
    this.subs.sink =      forkJoin([c,d,e,f]).subscribe(results => {

      this.modelWrapper=results[0];
      this.model = results[1];
      this.weekDays= results[2];
      this.summaryWrapper=results[3];



    this.model.forEach(r => {
      r.ReqSumEntryId=0;
      r.ReqDate=null;
      r.guid=this.commonService.newGuid();
      r.WeekId=this.selectedWeekID;
      r.FirstMondayId=this.selectedYear;
    });

    this.copyWeekID=0;
    this.copyYearID=0;

    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });

}

}
