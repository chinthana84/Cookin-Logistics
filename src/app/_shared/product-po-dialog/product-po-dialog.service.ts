import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RefTable } from 'src/app/models/reftable.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { MyDilaogObjectPO } from './product-po-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ProductPoDialogService {

  constructor() { }
  private subjectPro = new Subject<MyDilaogObjectPO>();

  ProductPopup(passingdata: Wrapper,selectedProductid :number ,selectedPodetailID:number,selectedProdUnitID:number ): any {
      this.ProductPopup_(passingdata,selectedProductid,selectedPodetailID,selectedProdUnitID,"confirm");
  }

  ProductPopup_(message: Wrapper,selectedProductid :number,selectedPodetailID:number,selectedProdUnitID:number,msgtype): any {
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
  this.subjectPro.next(obj)
   this.closeDialog()
}

 
closeDialog(){
  this.subjectPro.next();
}

}
