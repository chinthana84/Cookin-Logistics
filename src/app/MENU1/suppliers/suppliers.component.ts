import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.css"],
})
export class SuppliersComponent implements OnInit, IMyGrid {
  searchID = 1;
  model: Supplier = {};
  edited: boolean = false;


  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Supplier
      , defaultSortColumnName: "CompanyName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CompanyName", colText: 'Company Name' },
      { colName: "ContactName", colText: 'Contact Name' }
      ]
    },
    GridClassInstance: new Supplier(),
  };

  constructor(
    private auth:AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService
  ) {
    this.edited = false;
  }

  ngOnInit() {
  this.setPage(this.gridOption.searchObject);

    this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;

        this.model = new Supplier();
      } else if (params.id > 0) {
        this.edited = true;
        //'this.model = this.pieces.filter(i => i.Supplier_ID == params.id)[0]

        this.http
          .get<any>(`${environment.APIEndpoint}/supplier/GetByID/` + params.id)
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
    this.http
      .post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
       
        this.gridOption.datas = data;
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
    });
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
    this.http
      .post<any>(`${environment.APIEndpoint}/supplier`, obj, {})
      .subscribe((data) => {

        if (data.IsValid == false) {

          // this.confirmDialogService.confirmThis("Are you sure to delete?", function () {
          //   alert("Yes clicked");
          // }, function () {
          //   alert("No clicked");
          // })

          //this.confirmDialogService.messageBox("Data saved")
           this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
        //  this.confirmDialogService.messageBox(environment.dataSaved);
     //   this.router.navigate(['suppliers'], { relativeTo: this.activatedRoute.parent } );
     this.router.navigate(['suppliers']);
     this.setPage(this.gridOption.searchObject);
    //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //  this.router.onSameUrlNavigation = 'reload';



        // this.router.navigate("suppliers");
          //this.commonService.redirectTo('suppliers')

        }


      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });


    // this.toastr.success("ssssssssss")

    // this.confirmDialogService.messageBox("data saved")
    // // this.confirmDialogService.confirmThis("Are you sure to delete?", function () {
    // //   alert("Yes clicked");
    // // }, function () {
    // //   alert("No clicked");
    // // })
    //    this.router.navigate(['/suppliers'] );
  }
}
