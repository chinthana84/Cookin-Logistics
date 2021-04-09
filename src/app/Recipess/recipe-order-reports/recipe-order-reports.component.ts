import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { Order } from 'src/app/models/order.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-recipe-order-reports',
  templateUrl: './recipe-order-reports.component.html'
})
export class RecipeOrderReportsComponent implements OnInit {
  private subs = new SubSink();
  startWeekNo: number=0;
  endWeekNo: number=0;

  startWeekDate?: Date =null;
  endWeekDate?: Date=null;

  params: any = {};

  selectedOrder:number=0;
  selectedNumbers:number=0;

  firstMondayList: FirstMonday[] = [];
  orders :Order[]=[];
  selectedYear: number = 0;



  constructor(private confirmDialogService: ConfirmDialogService, private commonService: CommonService,
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {


 

    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Common/GetAllMondays`)
      .subscribe(r => {
        this.firstMondayList = r;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)
      .subscribe(r => {
        this.orders = r;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      this.params = params;

    });


  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  loadreports(searchType:string) {

    let user = this.commonService.getUserLoggedUserName();
    if (this.params.rptID == 1000) {
      let catDesc: string = ""

      if (searchType=='d'){
        this.startWeekNo=0;
        this.endWeekNo=0;
      }

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=0
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &w1=${this.startWeekNo}
                    &w2=${this.endWeekNo}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype=${searchType}
                    &cateDesc=${catDesc}`

      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }

  }

  loadreportsAuto(searchType:string) {

    let user = this.commonService.getUserLoggedUserName();
    if (this.params.rptID == 1000) {
      let catDesc: string = ""

      if (searchType=='d'){
        this.startWeekNo=0;
        this.endWeekNo=0;
      }

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=1
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &w1=${this.startWeekNo}
                    &w2=${this.endWeekNo}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype=${searchType}
                    &cateDesc=${catDesc}`

      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
  }

  LoadSingleOrder(){
    let user = this.commonService.getUserLoggedUserName();
    if (this.params.rptID == 1000) {
      let catDesc: string = ""

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=2
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &w1=${this.startWeekNo}
                    &w2=${this.endWeekNo}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype='d'
                    &orderID=${this.selectedOrder}
                    &students=${this.selectedNumbers}`

      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
  }

}
