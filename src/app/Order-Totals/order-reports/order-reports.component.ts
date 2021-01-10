import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirstMonday } from 'src/app/models/firstMondya.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-order-reports',
  templateUrl: './order-reports.component.html'
})
export class OrderReportsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  startWeekNo: number;
  endWeekNo: number;

  startWeekDate: Date;
  endWeekDate: Date;

  categoryID: number = 0;
  classid: number = 0;
  supplierid: number = 0;
  kitchenID: number = 0;

  firstMondayList: FirstMonday[] = [];
  selectedYear: number = 0;
  modelWrapper: Wrapper = {};

  params: any = {};

  showCate: boolean = false;
  showSup: boolean = false;
  showClass: boolean = false;
  showKitchen: boolean = false;

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

    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Common/GetOrderReportRelatedRef`)
      .subscribe(r => {
        this.modelWrapper = r;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      this.params = params;

      this.showCate = false;
      this.showCate = false;
      this.showClass = false;
      this.showSup = false;
      this.showKitchen=false

      if (this.params.rptID == 3) {
        this.showCate = true;
      }
      else if (this.params.rptID == 4 && this.params.subtype == 1) {
        this.showCate = true;
      }
      else if (this.params.rptID == 4 && this.params.subtype == 2) {
        this.showSup = true;
      }
      else if (this.params.rptID == 4 && this.params.subtype == 3) {
        this.showClass = true;
      }
      else if (this.params.rptID == 4 && this.params.subtype == 4) {
        this.showKitchen=true;
      }

      else if (this.params.rptID == 5 && this.params.subtype == 1) {
        this.showCate = true;
      }

    });


  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  loadreports() {

    let user = this.commonService.getUserLoggedUserName();
    if (this.params.rptID == 3) {
      let catDesc: string = ""
      let obj = this.modelWrapper.Categories.filter(r => r.CategoryId == this.categoryID)

      if (obj.length > 0) {
        catDesc = obj[0].CategoryName
      }

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=${this.params.subtype}
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &w1=${this.startWeekNo}
                    &w2=${this.endWeekNo}
                    &searchtype=w
                    &cateid=${this.categoryID}
                    &cateDesc=${catDesc}`

      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 1) {


      let query = `?rpt_id=${this.params.rptID}
                    &subtype=${this.params.subtype}
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &w1=${this.startWeekNo}
                    &w2=${this.endWeekNo}
                    &searchtype=w`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }

    else if (this.params.rptID == 4 && this.params.subtype == 2) {

      let supDesc: string = ""
      let obj = this.modelWrapper.Suppliers.filter(r => r.SupplierId == this.supplierid)

      if (obj.length > 0) {
        supDesc = obj[0].CompanyName
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &w1=${this.startWeekNo}
                  &w2=${this.endWeekNo}
                  &searchtype=w
                  &supplierID=${this.supplierid}
                  &supDesc=${supDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }

    else if (this.params.rptID == 4 && this.params.subtype == 3) {

      let classDesc: string = ""
      let obj = this.modelWrapper.Classes.filter(r => r.ClassId == this.classid)

      if (obj.length > 0) {
        classDesc = obj[0].ClassCode
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &w1=${this.startWeekNo}
                  &w2=${this.endWeekNo}
                  &searchtype=w
                  &classid=${this.classid}
                  &classDesc=${classDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 4) {

      let VenuDesc: string = ""
      let obj = this.modelWrapper.Venues.filter(r => r.KitchenId == this.kitchenID)

      if (obj.length > 0) {
        VenuDesc = obj[0].KitchenCode
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &w1=${this.startWeekNo}
                  &w2=${this.endWeekNo}
                  &searchtype=d
                  &venuid=${this.kitchenID}
                  &VenuDesc=${VenuDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }

    else if (this.params.rptID == 5 && this.params.subtype == 1) {

      let catDesc: string = ""
      let obj = this.modelWrapper.Categories.filter(r => r.CategoryId == this.categoryID)

      if (obj.length > 0) {
        catDesc = obj[0].CategoryName
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &w1=${this.startWeekNo}
                  &w2=${this.endWeekNo}
                  &searchtype=w
                  &categoryid=${this.categoryID}
                  &cateDesc=${catDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }


  }











  loadreportsDate() {


    let user = this.commonService.getUserLoggedUserName();
    if (this.params.rptID == 3) {
      let catDesc: string = ""
      let obj = this.modelWrapper.Categories.filter(r => r.CategoryId == this.categoryID)
      debugger
      if (obj.length > 0) {
        catDesc = obj[0].CategoryName
      }

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=${this.params.subtype}
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype=d
                    &cateid=${this.categoryID}
                    &cateDesc=${catDesc}`

      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 1) {

      let query = `?rpt_id=${this.params.rptID}
                    &subtype=${this.params.subtype}
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype=d`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 2) {
      let supDesc: string = ""
      let obj = this.modelWrapper.Suppliers.filter(r => r.SupplierId == this.supplierid)

      if (obj.length > 0) {
        supDesc = obj[0].CompanyName
      }
      let query = `?rpt_id=${this.params.rptID}
                    &subtype=${this.params.subtype}
                    &selectedYearID=${this.selectedYear}
                    &user=${user}
                    &d1=${this.startWeekDate}
                    &d2=${this.endWeekDate}
                    &searchtype=d
                    &supplierID=${this.supplierid}
                    &supDesc=${supDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 3) {

      let classDesc: string = ""
      let obj = this.modelWrapper.Classes.filter(r => r.ClassId == this.classid)

      if (obj.length > 0) {
        classDesc = obj[0].ClassCode
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &d1=${this.startWeekDate}
                  &d2=${this.endWeekDate}
                  &searchtype=d
                  &classid=${this.classid}
                  &classDesc=${classDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }
    else if (this.params.rptID == 4 && this.params.subtype == 4) {

      let VenuDesc: string = ""
      let obj = this.modelWrapper.Venues.filter(r => r.KitchenId == this.kitchenID)

      if (obj.length > 0) {
        VenuDesc = obj[0].KitchenCode
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &d1=${this.startWeekDate}
                  &d2=${this.endWeekDate}
                  &searchtype=d
                  &venuid=${this.kitchenID}
                  &VenuDesc=${VenuDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }

    else if (this.params.rptID == 5 && this.params.subtype == 1) {

      let catDesc: string = ""
      let obj = this.modelWrapper.Categories.filter(r => r.CategoryId == this.categoryID)

      if (obj.length > 0) {
        catDesc = obj[0].CategoryName
      }
      let query = `?rpt_id=${this.params.rptID}
                  &subtype=${this.params.subtype}
                  &selectedYearID=${this.selectedYear}
                  &user=${user}
                  &d1=${this.startWeekDate}
                  &d2=${this.endWeekDate}
                  &searchtype=w
                  &categoryid=${this.categoryID}
                  &cateDesc=${catDesc}`


      this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
    }



  }
}
