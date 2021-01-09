import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { environment } from 'src/environments/environment';
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { CommonService } from '../../_services/common.service';

@Component({
  selector: 'app-common-viewer',
  templateUrl: './common-viewer.component.html',
  styleUrls: ['./common-viewer.component.css']
})
export class CommonViewerComponent implements OnInit {
  startWeekNo :number;
  endWeekNo:number;

  startWeekDate :Date;
  endWeekDate:Date;

  tutorId:number=0;
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

    this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllReftsForRequisitionSummary`).subscribe(r=>{
      this.modelWrapper=r;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });


  }


  loadreports(){
    this.activatedRoute.queryParams.subscribe((params) => {
      let user=this.commonService.getUserLoggedUserName();




      if (params.rptID == 2) {
        let query=`?rpt_id=${params.rptID}
        &selectedYearID=${this.selectedYear}
        &user=${user}
        &w1=${this.startWeekNo}
        &w2=${this.endWeekNo}
        &classid=${this.classid}
        &tutorid=${this.tutorId}
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
        &tutorid=${this.tutorId}
        &type=d`

        this.commonService.goCNN(query);
        }

      });

  }

}
