import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RefTable } from 'src/app/models/reftable.model';
import { MyDilaogObjectPO } from './product-po-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ProductPoDialogService {

  constructor() { }

  private subjectPro = new Subject<MyDilaogObjectPO>();

  private subjectSelectedproduct = new Subject<string>();

  ProductPopup(passingdata: any,selectedProductid :number ,selectedPodetailID:number,selectedProdUnitID:number ): any {

      this.ProductPopup_(passingdata,selectedProductid,selectedPodetailID,selectedProdUnitID,"confirm");
  }

  ProductPopup_(message: any,selectedProductid :number,selectedPodetailID:number,selectedProdUnitID:number,msgtype): any {
    const that = this;

    this.subjectPro.next({
        type: msgtype,
        passingDataModels:message,
        SelectedProductId:selectedProductid,
        SelectedPODetailID:selectedPodetailID,
        SelectedProductUnitID:selectedProdUnitID
    });

}

getProdut(): Observable<MyDilaogObjectPO> {
  return this.subjectPro.asObservable();
}

addSelectedProduct(obj:any){
  this.subjectSelectedproduct.next(obj)
  this.closeDialog()
}

getSelectedProduct():Observable<any> {
  return this.subjectSelectedproduct.asObservable();
}

closeDialog(){
  this.subjectPro.next();
}

}
