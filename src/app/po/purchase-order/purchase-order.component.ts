import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
export class PurchaseOrderComponent implements OnInit,OnDestroy {
  private subs = new SubSink();
  edited: boolean = false;
  model: PoHeaer={};
  workingPODetailID:number=0;

  modelWrapper: Wrapper = {};

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
    this.model.Podetails=[];
    this.setPage(this.gridOption.searchObject);

  this.subs.sink=  this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new PoHeaer();
        this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/po/GetPORelatedRef`)
        .subscribe((data) => { this.modelWrapper = data;console.log(data) }
        , (error) => {
              this.confirmDialogService.messageBox(environment.APIerror)
            });


      } else if (params.id > 0) {
        this.edited = true;
        // this.subs.sink=    this.http
        //   .get<any>(`${environment.APIEndpoint}/Common/GetTutorByID/` + params.id)
        //   .subscribe((data) => {
        //     this.model = data;
        //   }, (error) => {
        //     this.confirmDialogService.messageBox(environment.APIerror)
        //   });
      } else {
        this.edited = false;
      }
    });

    this.subs.sink= this.productPoDialogService.getSelectedProduct().subscribe(message => {
      debugger
        this.AddProduct(message);
        });

  }

  setPage(obj: SearchObject) {
    this.subs.sink=   this.gridService.getGridData(obj).subscribe((data) => {
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

  // AddNewItem(obj: Podetails){
  //   this.productPoDialogService.ProductPopup(this.modelWrapper,0,0,0);
  // }

  // EditItem(obj: Podetails){
  //   debugger
  //   this.productPoDialogService.ProductPopup(this.modelWrapper,obj.ProductId,obj.PodetailId,obj.ProdUnitId);
  // }

  AddProdutDialog(prod_id:number,podetailid:number,produnitid:number){
    this.workingPODetailID=podetailid;
    this.productPoDialogService.ProductPopup(this.modelWrapper,prod_id,0,produnitid);
  }

  AddProduct(obj:Product){

    var newDet=new Podetails();

    newDet.ProductDescription=obj.ProductName;
    newDet.ProductUnitDescription=obj.ProdUnit.RefDescription;
    newDet.ProductId=obj.ProductId;
    newDet.ProdUnitId=obj.ProdUnitId;
    newDet.guid=this.commonService.newGuid();


    if (this.model.Podetails == undefined){
      this.model.Podetails=[];
    }
    this.model.Podetails.push(newDet)



  }

  deleteProduct(item :any){
    debugger

    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      if(item.PodetailId > 0)
      {
        this.model.Podetails =  this.model.Podetails.filter(i => i.PodetailId != item.PodetailId);

      }
      else{
        this.model.Podetails =  this.model.Podetails.filter(i => i.guid != item.guid);

      }
    },
      function () { })

  }

  Save() {

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
