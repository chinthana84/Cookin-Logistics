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

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.css"],
})
export class SuppliersComponent implements OnInit {
  searchID = 1;
  model: Supplier = {};
  edited: boolean = false;

  searchObject: SearchObject = {};
  gridOption: GridOptions = {
    colNames: [{ colName: "CompanyName" }],
    datas: {},
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService:CommonService
  ) {
    this.edited = false;
  }

  ngOnInit() {
    this.setPage({ pageNo: 1, searchColName: "" });

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params.id); // { order: "popular" }

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
          });

        console.log(this.model);
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    obj.girdId = GridType.Supplier;
    obj.defaultSortColumnName = "CompanyName";

    this.http
      .post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        console.log(data);
        this.gridOption.datas = data;
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
        console.log(data);

        this.toastr.success("ssssssssss");

 
        this.commonService.redirectTo('suppliers')
      });

    // this.toastr.success("ssssssssss")
    // console.log(form)
    // this.confirmDialogService.messageBox("data saved")
    // // this.confirmDialogService.confirmThis("Are you sure to delete?", function () {
    // //   alert("Yes clicked");
    // // }, function () {
    // //   alert("No clicked");
    // // })
    //    this.router.navigate(['/suppliers'] );
  }
}
