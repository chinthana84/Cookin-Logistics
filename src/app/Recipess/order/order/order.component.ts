import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { OrdersGridDTO } from 'src/app/models/Grid/grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order, OrderDetails, OrderTheoryNotesDTO } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Recipe, RecipeOrderLinkDTO } from 'src/app/models/recipe.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { ErrorHandlerService } from 'src/app/_shared/_services/error-handler.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  edited: boolean = false;
  modelOrder: Order = {};
  modelWrapper: Wrapper = {};
  selectedCouseID: number = 0;
  selectedRecipeID: number = 0;
  modelRecipeHeader: Recipe[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Order
      , defaultSortColumnName: "OrderDescription",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "OrderDescription", colText: 'Order Description' }
      ]
    }
  };
  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public commonService: CommonService,
    private gridService: GridService) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;

        this.modelOrder = new Order();
        this.modelOrder.OrderDetails = [];

        this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
        .subscribe((data) => { this.modelWrapper = data; });

      } else if (params.id > 0) {
        this.edited = true;

        let a = this.http.get<any>(`${environment.APIEndpoint}/order/GetByID/` + params.id);
        let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)

        this.subs.sink = forkJoin([a, b]).subscribe(results => {
          this.modelOrder = results[0]
          this.modelWrapper = results[1];
          console.log(this.modelOrder)
        },
          (error) => {
            this.confirmDialogService.messageBox(environment.APIerror);
            this.errorHandler.handleError(error);
          });
      } else {
        this.edited = false;
      }
    });

  }


  setPage(obj: SearchObject): void {
    this.subs.sink = this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }



  Action(obj: OrdersGridDTO) {
    if (obj == undefined) {
      this.router.navigate(['/orders/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/orders/edit'], { queryParams: { id: obj.OrderId } });
    }
    this.edited = true
  }

  public AddOrderLine(): void {
    var obj = new OrderDetails();
    obj.OrderId = this.modelOrder.OrderId;
    console.log(obj);
    this.modelOrder.OrderDetails.push(obj);
  }


  unitPriceDefaultValues(val: any, obj: OrderDetails) {
    debugger
    if (val === 0 || val === null || val === undefined) {
      let objProd = this.getProductObject(obj.ProductId)
      obj.UnitPrice = objProd.UnitPrice
    }
    else {
      obj.UnitPrice = val;
    }

  }

  public deleteOrderLine(id: number): void {
    let that: this;
    let IsOk: Boolean = false;
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.modelOrder.OrderDetails = this.modelOrder.OrderDetails.filter(item => item.OrderDetailsId != id);
    },
      function () { })

  }

  onSubmit(obj: Order) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Order/Save`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['orders']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }


  getProductObject(i: number): Product {
    let x = this.modelWrapper.Products.filter(b => b.ProductId == i)
    return x[0];
  }

  AddNote() {
    let obj = new OrderTheoryNotesDTO();
    obj.OrderId = this.modelOrder.OrderId;
    if (this.modelOrder.OrderTheoryNotes == undefined) {
      this.modelOrder.OrderTheoryNotes = [];
    }
    this.modelOrder.OrderTheoryNotes.push(obj);
  }

  deleteNote(obj: OrderTheoryNotesDTO) {
    this.modelOrder.OrderTheoryNotes = this.modelOrder.OrderTheoryNotes.
      filter(r => r.TheoryNoteId != obj.TheoryNoteId);
  }

  addFile(event, i: OrderTheoryNotesDTO): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.commonService
        .upload(file)
        .subscribe(res => {
          i.UniqueFileName = String(res);
        });
    }
  }

  GetSelectedCouseRecipes(couseid: number) {
    this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetRecipeHeaderByCourseID/` + couseid)
      .subscribe(r => {
        this.modelRecipeHeader = r;
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

  AddLinkRecipe(recipeid: number) {
    let selectedRecipe = this.modelRecipeHeader.filter(r => r.RecipeId == recipeid)[0]
    let obj = new RecipeOrderLinkDTO();
    obj.OrderId = this.modelOrder.OrderId;
    obj.RecipeId = recipeid;
    obj.Recipe = selectedRecipe;
    this.modelOrder.RecipeOrderLink.push(obj);
  }

  DeleteLinkRecipe(recipeLinkID: number) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.modelOrder.RecipeOrderLink = this.modelOrder.RecipeOrderLink.filter(r => r.ROLinkId != recipeLinkID);
    },
      function () { });
  }

  unitIDDefaultValues(val: any, obj: OrderDetails) {
    obj.ProdUnitId = 0;
    let objProd = this.getProductObject(obj.ProductId)
    obj.ProdUnitId = objProd.ProdUnit.RefId;
    obj.UnitPrice = objProd.UnitPrice;
  }

  AutoBuild(){
    this.confirmDialogService.confirmThis("are you sure?", () => {
      this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Order/OrderDetailAutoBuild`, this.modelOrder.RecipeOrderLink, {})
      .subscribe((data) => {
        this.modelOrder.OrderDetails=data;
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

    },
      function () { });


  }

}
