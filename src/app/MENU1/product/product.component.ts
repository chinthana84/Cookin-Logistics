import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Categories } from "src/app/models/categories.model";
import { ProductGridDTO } from 'src/app/models/Grid/grid.model';

import { GridType } from "src/app/models/gridType.enum";
import {
  Product,
  ProductStorages,
  StorageAreas,
} from "src/app/models/product.model";
import { RefTable } from 'src/app/models/reftable.model';
import { Supplier } from "src/app/models/supplier.model";
import { IMyGrid } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from "src/app/_shared/confirm-dialog/confirm-dialog.service";
import { GridOptions } from "src/app/_shared/_grid/gridModels/gridOption.model";
import { SearchObject } from "src/app/_shared/_grid/gridModels/searchObject.model";
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from "src/environments/environment";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit,IMyGrid {

  edited: boolean = false;
  model: Product = {};
  modelCategory: Categories[] = [];
  modelSupplier: Supplier[] = [];
  modelStorageAreas: StorageAreas[] = [];
  modelProductUnits:RefTable[]=[];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Product
      , defaultSortColumnName: "ProductName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "ProductName", colText: 'Product Name' },
      { colName: "CompanyName", colText: 'Company Name' }
      ]
    }
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

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.http
      .get<any>(`${environment.APIEndpoint}/common/GetAllSuppliers`)
      .subscribe((data) => {
        this.modelSupplier = data;
      });

    this.http
      .get<any>(`${environment.APIEndpoint}/common/GetAllStorageAreas`)
      .subscribe((data) => {
        this.modelStorageAreas = data;
      });
    this.http
      .get<any>(`${environment.APIEndpoint}/product/GetAllCategory`)
      .subscribe((data) => {
        this.modelCategory = data;
      });
this.http
      .get<any>(`${environment.APIEndpoint}/common/GetAllProductionUnits`)
      .subscribe((data) => {
        this.modelProductUnits = data;
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.model = new Product();
        this.model.Category = new Categories();
        this.model.Supplier = new Supplier();
      } else if (params.id > 0) {
        this.edited = true;
        this.http
          .get<any>(
            `${environment.APIEndpoint}/Product/GetProductByID/` + params.id
          )
          .subscribe((data) => {
            this.model = data;
            console.log(data);
          });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
     this.http
      .post<ProductGridDTO>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

  Action(obj: Product) {
    if (obj == undefined) {
      this.router.navigate(["/products/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/products/edit"], {
        queryParams: { id: obj.ProductId },
      });
    }
    this.edited = true;
  }

  getUnit():string
  {
    console.log(this.model.ProdUnitId)
    var x=  this.modelProductUnits.filter(b=> b.RefId ==this.model.ProdUnitId) ;
   if (x[0] == undefined)
   {
     return ""
   }
   return x[0].RefDescription;
  }

  getCal1():string{
    var x= (this.model.UnitPrice / this.model.Yield)*100;
    if (isNaN(x)){
      return "0"
    }
    return '$' + x.toFixed(2).toString();
  }

  getCal2():string{
    var x=  100/this.model.Yield
    if (isNaN(x)){
      return "0"
    }
    return x.toFixed(2).toString();
  }

  AddStorageArea() {
    var obj = new ProductStorages();
    obj.ProductId = this.model.ProductId;
    this.model.ProductStorages.push(obj);
  }

  deleteStorageAeras(obj:ProductStorages)
  {
    this.model.ProductStorages=    this.model.ProductStorages.filter(item => item.ProductStorageId != obj.ProductStorageId);
  }

  onSubmit(obj: Product) {

      this.http
        .post<any>(`${environment.APIEndpoint}/Product`, obj, {})
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

          this.router.navigate(['products']);
          this.setPage(this.gridOption.searchObject);

    //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //  this.router.onSameUrlNavigation = 'reload';
    //  this.router.navigate(['products']);

          }


        }, (error) => {

          this.confirmDialogService.messageBox(environment.APIerror)
        });

  }
}
