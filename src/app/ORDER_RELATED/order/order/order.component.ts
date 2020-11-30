import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrdersGridDTO } from 'src/app/models/Grid/grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order } from 'src/app/models/order.model';
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
  modelOrder :Order;
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
  constructor(    private http: HttpClient,
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
      } else if (params.id > 0) {
        this.edited = true;
       this.http
          .get<any>(`${environment.APIEndpoint}/order/GetByID/` + params.id)
          .subscribe((data) => {
            this.modelOrder = data;
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
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
      this.router.navigate(['/category/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/category/edit'], { queryParams: { id: obj.OrderId } });
    }
    this.edited = true
  }

}
