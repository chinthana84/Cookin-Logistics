import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridType } from 'src/app/models/gridType.enum';
import { Podetails, PoHeaer } from 'src/app/models/poheader.model';
import { Product } from 'src/app/models/product.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { ProductPoDialogService } from 'src/app/_shared/product-po-dialog/product-po-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { ErrorHandlerService } from 'src/app/_shared/_services/error-handler.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  edited: boolean = false;
  model: PoHeaer = {};
  workingPODetailID: number = 0;

  datePickerConfig = {
    drops: 'down',
    format: 'YYYY-MM-DD'
  }

  modelWrapper: Wrapper = {};

    getOnlyDate(t:any) {
    var d = new Date(t);
    var n = d.getDate();

    return n;
  }

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.PO
      , defaultSortColumnName: "Poid",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "Pono", colText: ' Pono' },
      { colName: "CompanyName", colText: 'CompanyName' }
      ]
    }
  };

  constructor(private gridService: GridService,
    private errorHandler: ErrorHandlerService,
    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public productPoDialogService: ProductPoDialogService
  ) {
    this.edited = false
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  ngOnInit(): void {
    this.model.Podetails = [];
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new PoHeaer();
        this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/po/GetPORelatedRef`)
          .subscribe((data) => { this.modelWrapper = data; console.log(data) }
            , (error) => {
              this.confirmDialogService.messageBox(environment.APIerror)
            });


      } else if (params.id > 0) {
        this.edited = true;
        let a = this.http.get<any>(`${environment.APIEndpoint}/po/GetPORelatedRef`);
        let b = this.http.get<any>(`${environment.APIEndpoint}/PO/GetPoByID/` + params.id)

        this.subs.sink = forkJoin([a, b]).subscribe(results => {
          this.modelWrapper = results[0]
          this.model = results[1];
          console.log(this.model)

        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });



      } else {
        this.edited = false;
      }
    });

    this.subs.sink = this.productPoDialogService.getProdut().subscribe(message => {
      debugger
      if (message != undefined && message.SelectedProductId > 0) {
        this.AddProduct(message);
      }
    });

  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: PoHeaer) {
    if (obj == undefined) {
      this.router.navigate(["/po/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/po/edit"], {
        queryParams: { id: obj.Poid },
      });
    }
    this.edited = true;
  }



  AddProdutDialog(prod_id: number, podetailid: number, produnitid: number) {
    this.workingPODetailID = podetailid;
    this.productPoDialogService.ProductPopup(this.modelWrapper, prod_id, 0, produnitid);
  }

  AddProduct(obj: any) {

    debugger;
    var newDet = new Podetails();
    newDet.Product = obj.Product;
    newDet.guid=this.commonService.newGuid();
    newDet.Poid=this.model.Poid;
    newDet.ProductId=obj.SelectedProductId;
    newDet.ProdUnitId=obj.SelectedProductUnitID;



    if (this.model.Podetails == undefined) {
      this.model.Podetails = [];
    }
    this.model.Podetails.push(newDet)



  }

  deleteProduct(item: any) {
    debugger

    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      if (item.PodetailId > 0) {
        this.model.Podetails = this.model.Podetails.filter(i => i.PodetailId != item.PodetailId);

      }
      else {
        this.model.Podetails = this.model.Podetails.filter(i => i.guid != item.guid);

      }
    },
      function () { })

  }

  Save() {
debugger
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PO/Save`, this.model, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['po']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

}
