import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { SubSink } from 'subsink';
import { ProductPoDialogService } from './product-po-dialog.service';

@Component({
  selector: 'app-product-po-dialog',
  templateUrl: './product-po-dialog.component.html',
  styleUrls: ['./product-po-dialog.component.css']
})
export class ProductPoDialogComponent implements OnInit {

  private subs = new SubSink();
  obj: MyDilaogObjectPO;

  constructor(public productPoDialogService: ProductPoDialogService ) { }

  ngOnInit(): any {
    this.subs.sink = this.productPoDialogService.getProdut().subscribe(message => {
      debugger
      this.obj = message;

    });
  }

  addProduct(i: number): any {
    debugger
    let x = this.obj.passingDataModels.Products.filter(b => b.ProductId == i)
    let y = this.obj.passingDataModels.ProdUnits.filter(b => b.RefId == this.obj.SelectedProductUnitID)[0]

    x[0].ProdUnit=y;
    x[0].ProdUnitId=y.RefId;
    x[0].ProdUnit=y;

    this.obj.Product=x[0];

    this.productPoDialogService.addSelectedProduct(this.obj);
  }

  GetSelectedProduct(productid :number){
    debugger;
    let x = this.obj.passingDataModels.Products.filter(b => b.ProductId == productid);
    this.obj.SelectedProductId=x[0].ProductId;
    this.obj.SelectedProductUnitID=x[0].ProdUnitId;


    let y = this.obj.passingDataModels.ProdUnits.filter(b => b.RefId == this.obj.SelectedProductUnitID)[0]
    this.obj.ProductDescription=x[0].ProductDescription
    this.obj.ProductUnitDescription=y.RefDescription
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}


export class MyDilaogObjectPO {
  public type?: string = '';
  public passingDataModels?: any;
  public SelectedProductId?: number = 0;
  public SelectedProductUnitID?: number = 0;
  public EnterdUnitPrice?: number = 0;
  public SelectedPODetailID?: number = 0;

  public ProductDescription?:string="";
  public ProductUnitDescription?:string=""

  public Product?: Product;

  noFn?: () => void;
  AddFn?: () => void;

}
