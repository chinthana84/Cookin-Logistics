import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Categories } from "src/app/models/categories.model";
import { GridType } from "src/app/models/gridType.enum";
import {
  Product,
  ProductStorages,
  StorageAreas,
} from "src/app/models/product.model";
import { Supplier } from "src/app/models/supplier.model";
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
export class ProductComponent implements OnInit {
  searchID = 1;
  edited: boolean = false;
  model: Product = {};
  modelCategory: Categories[] = [];
  modelSupplier: Supplier[] = [];
  modelStorageAreas: StorageAreas[] = [];

  searchObject: SearchObject = {};
  gridOption: GridOptions = {
    colNames: [{ colName: "ProductName" }],
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

  ngOnInit(): void {
    this.setPage({ pageNo: 1, searchColName: "" });

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
    obj.girdId = GridType.Product;
    obj.defaultSortColumnName = "ProductName";

    this.http
      .post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
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

  AddStorageArea() {
    var obj = new ProductStorages();
    obj.ProductId = this.model.ProductId;
    this.model.ProductStorages.push(obj);
  }

  onSubmit(obj: Product) {
    try {
      this.http
        .post<any>(`${environment.APIEndpoint}/Product`, obj, {})
        .subscribe((data) => {
          console.log(data);

          this.toastr.success("ssssssssss");
this.commonService.redirectTo('products');

        }, err => {
          this.confirmDialogService.messageBox(err.Message)

        });
    } catch (Error) {
      this.confirmDialogService.messageBox("data saved")

    }
  }
}
