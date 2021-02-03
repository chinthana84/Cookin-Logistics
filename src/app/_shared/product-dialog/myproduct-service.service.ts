import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MyDilaogObject } from './product-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MyproductServiceService {

  constructor() { }

  private subjectPro = new Subject<MyDilaogObject>();

  private subjectSelectedproduct = new Subject<string>();

  ProductPopup(passingdata: any,selectedProductid :number ,selectedOrderDetid:number ): any {

      this.ProductPopup_(passingdata,selectedProductid,selectedOrderDetid,"confirm");
  }

  ProductPopup_(message: any,selectedProductid :number,selectedOrderDetid:number,msgtype): any {
    const that = this;

    this.subjectPro.next({
        type: msgtype,
        passingDataModels:message,
        SelectedProductId:selectedProductid,
        SelectedOrderDetailID:selectedOrderDetid
    });

}

getProdut(): Observable<MyDilaogObject> {

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
