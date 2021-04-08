import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { MyproductServiceService } from './myproduct-service.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  private subs = new SubSink();
  obj: MyDilaogObject;

    constructor(
        public myproductServiceService: MyproductServiceService
    ) { }

    ngOnInit(): any {
      this.subs.sink= this.myproductServiceService.getProdut().subscribe(message => {
            this.obj = message;
        });
    }

    addProduct(i:number):any{
       
      let x = this.obj.passingDataModels.Products.filter(b => b.ProductId == i)

     let y=  this.obj.passingDataModels.ProdUnits.filter(b => b.ProductId == this.obj.SelectedProductUnitID)[0]
      this.myproductServiceService.addSelectedProduct(x[0]);

        }

    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }


}

export class MyDilaogObject{
  public type?:string='';
  public passingDataModels?:any;
  public SelectedProductId?:number=0;
  public SelectedProductUnitID?:number=0;
  public EnterdUnitPrice?:number=0;
  public SelectedOrderDetailID?:number=0;

  noFn?: () => void ;
  AddFn?: () => void;

}
