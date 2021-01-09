import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-reports',
  templateUrl: './order-reports.component.html'
})
export class OrderReportsComponent implements OnInit {

  startWeekNo :number;
  endWeekNo:number;

  startWeekDate :Date;
  endWeekDate:Date;

  categoryID:number=0;
  classid:number=0;

  firstMondayList :FirstMonday[]=[];
  selectedYear:number=0;
  modelWrapper: Wrapper = {};

  constructor(      private confirmDialogService: ConfirmDialogService,  private commonService: CommonService,
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService) { }


  ngOnInit(): void {

    this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllMondays`)
    .subscribe(r=>{
      this.firstMondayList=r;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });

    this.http.get<any>(`${environment.APIEndpoint}/Common/GetOrderReportRelatedRef`)
    .subscribe(r=>{
      this.modelWrapper=r;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });


  }


  loadreports(){
    this.activatedRoute.queryParams.subscribe((params) => {
      let user=this.commonService.getUserLoggedUserName();

      // If Request.QueryString.Get("subtype") = "1" And
      // Request.QueryString.Get("searchtype") = "w" Then
      // Dim user As String = Request.QueryString.Get("user")
      // Dim w1 As Integer = Request.QueryString.Get("w1")
      // Dim w2 As Integer = Request.QueryString.Get("w2")

      // rpt.Load(Server.MapPath("~/Reports/rptOrderTotals_3.rpt"))
      // rpt.SetParameterValue("@startweek", w1)
      // rpt.SetParameterValue("@endweek", w2)
      // rpt.SetParameterValue("@selectedYearID", Request.QueryString.Get("selectedYearID"))
      // rpt.SetParameterValue("@startweekdate", DateTime.Now)
      // rpt.SetParameterValue("@endweekdate", DateTime.Now)


      if (params.rptID == 3) {
        let query=`?rpt_id=${params.rptID}
        &searchtype=${params.subtype}
        &selectedYearID=${this.selectedYear}
        &user=${user}
        &w1=${this.startWeekNo}
        &w2=${this.endWeekNo}
        &searchtype=w`
        this.commonService.goCNN(query);
        }

      });
  }

  loadreportsDate(){
    this.activatedRoute.queryParams.subscribe((params) => {
      this.startWeekNo=0;
      this.endWeekNo=0;
      let user=this.commonService.getUserLoggedUserName();
      if (params.rptID == 2) {
        let query=`?rpt_id=${params.rptID}
        &selectedYearID=${this.selectedYear}
        &user=${user}
        &d1=${this.startWeekDate}
        &d2=${this.endWeekDate}
        &classid=${this.classid}
        &type=d`

        this.commonService.goCNN(query);
        }

      });

  }
}
