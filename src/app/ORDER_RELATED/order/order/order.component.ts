import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { OrdersGridDTO } from 'src/app/models/Grid/grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order, OrderDetails, OrderTheoryNotesDTO } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit,OnDestroy {
  private subs = new SubSink();
  edited: boolean = false;
  modelOrder: Order = {};
  modelWrapper: Wrapper = {};

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

    this.subs.sink =   this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;

        this.modelOrder = new Order();
        this.modelOrder.OrderDetails = [];

        this.subs.sink =     this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`).subscribe((data) => { this.modelWrapper = data; });

      } else if (params.id > 0) {
        this.edited = true;

        let a = this.http.get<any>(`${environment.APIEndpoint}/order/GetByID/` + params.id);
        let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)

        this.subs.sink =      forkJoin([a, b]).subscribe(results => {
          this.modelOrder = results[0]
          this.modelWrapper = results[1];
        });

      } else {
        this.edited = false;
      }
    });

  }


  setPage(obj: SearchObject): void {
    this.subs.sink =    this.gridService.getGridData(obj).subscribe((data) => {
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
    this.subs.sink =    this.http
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

  AddNote(){
    let obj=new OrderTheoryNotesDTO();
    obj.OrderId=this.modelOrder.OrderId;
    if(this.modelOrder.OrderTheoryNotes == undefined){
      this.modelOrder.OrderTheoryNotes=[];
    }
    this.modelOrder.OrderTheoryNotes.push(obj);
  }

  deleteNote(obj:OrderTheoryNotesDTO){
    this.modelOrder.OrderTheoryNotes=this.modelOrder.OrderTheoryNotes.
                                    filter(r=> r.TheoryNoteId != obj.TheoryNoteId);
  }



  addFile(event, i:OrderTheoryNotesDTO): void {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');

        this.commonService
                  .upload(file)
                  .subscribe(res => {
                    console.log(res)

                      i.UniqueFileName= String(res);

                  });
    }

  }

}
