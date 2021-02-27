import { Component, OnDestroy, OnInit } from "@angular/core";
import { SearchObject } from "src/app/_shared/_grid/gridModels/searchObject.model";
import { GridOptions } from "src/app/_shared/_grid/gridModels/gridOption.model";
import {
  ActivatedRoute,
  Route,
  NavigationEnd,
  Router,
  Params,
} from "@angular/router";
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from "@angular/router";
import { Supplier } from "src/app/models/supplier.model";
import { ToastrService } from "ngx-toastr";
import { ConfirmDialogService } from "src/app/_shared/confirm-dialog/confirm-dialog.service";
import { HttpClient } from "@angular/common/http";
import { GridType } from "src/app/models/gridType.enum";
import { environment } from "src/environments/environment";
import { CommonService } from 'src/app/_shared/_services/common.service';
import { IMyGrid } from 'src/app/models/wrapper.model';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';
import { SubSink } from 'subsink';
import { ErrorHandlerService } from "src/app/_shared/_services/error-handler.service";

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.css"],
})
export class SuppliersComponent implements OnInit, IMyGrid, OnDestroy {
  private subs = new SubSink();
  model: Supplier = {};
  edited: boolean = false;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Supplier
      ,SavedDBColumn:"SupplierID"
      , defaultSortColumnName: "CompanyName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CompanyName", colText: 'Company Name' },
      { colName: "ContactName", colText: 'Contact Name' }
      ]
    }
  };

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public commonService: CommonService
  ) {
    this.edited = false;
  }

  ngOnInit() {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink =  this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;
        this.model = new Supplier();
      } else if (params.id > 0) {
        this.edited = true;
        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/supplier/GetByID/` + params.id)
          .subscribe((data) => { this.model = data; }, (error) =>
          {
            //this.confirmDialogService.messageBox(environment.APIerror)


            this.errorHandler.handleError(error);

          });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http .post<any>(`${environment.APIEndpoint}/grid`, obj, {})
    .subscribe((data) => {
      this.gridOption.datas = data;
      this.gridOption.searchObject.saveID=0;
    }, (error) => {
     // this.confirmDialogService.messageBox(environment.APIerror) ;
      this.errorHandler.handleError(error); });
  }

  Supplier(item: Supplier) {
    if (item == undefined) {
      this.router.navigate(["/suppliers/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/suppliers/edit"], {
        queryParams: { id: item.SupplierId },
      });
    }
    this.edited = true;
  }

  onSubmit(obj: Supplier) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/supplier`, obj, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)

        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['suppliers']);
          this.gridOption.searchObject.saveID=data.SavedID;
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)

        this.errorHandler.handleError(error);

      });
  }

  LoadReport(){
    let user = this.commonService.getUserLoggedUserName();
    let query = `?rpt_id=6&user=${user}`

this.commonService.goCNN(query.replace(/\s{2,}/g, ""));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
