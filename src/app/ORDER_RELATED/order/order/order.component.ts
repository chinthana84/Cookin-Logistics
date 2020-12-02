import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { OrdersGridDTO } from 'src/app/models/Grid/grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order, OrderDetails } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  edited: boolean = false;
  modelOrder: Order = {};


  modelWrapper: Wrapper = {};


  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Order
      , defaultSortColumnName: "StudentNumbers",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "StudentNumbers", colText: 'Student Numbers' }
      ]
    }
  };
  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService,
    private gridService: GridService) { }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;

        this.modelOrder = new Order();
        this.modelOrder.OrderDetails = [];

        this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`).subscribe((data) => { this.modelWrapper = data; });

      } else if (params.id > 0) {
        this.edited = true;

        let a = this.http.get<any>(`${environment.APIEndpoint}/order/GetByID/` + params.id);
        let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)

        forkJoin([a, b]).subscribe(results => {
          this.modelOrder = results[0]
          this.modelWrapper = results[1];
        });

      } else {
        this.edited = false;
      }
    });

  }


  setPage(obj: SearchObject): void {
    this.gridService.getGridData(obj).subscribe((data) => {
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
    this.modelOrder.OrderDetails.push(obj);
  }

  public deleteOrderLine(id: number): void {
    let that: this;
    let IsOk: Boolean = false;
    this.confirmDialogService.confirmThis("Are you sure to delete?", ()=>{
      this.modelOrder.OrderDetails = this.modelOrder.OrderDetails.filter(item => item.OrderDetailsId != id);
    },
    function () { })

  }

  onSubmit(obj: Order) {
    this.http
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
}
