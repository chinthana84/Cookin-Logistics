import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/Shared.module';
import { DpDatePickerModule } from 'ng2-date-picker';
const routes: Routes = [
  {
    path: 'po',data:{titleKey: 'PO'}, component: PurchaseOrderComponent
    , children: [{ path: 'edit', component: PurchaseOrderComponent }]
  }
];


@NgModule({
  declarations: [PurchaseOrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(routes),
    SharedModule,
    DpDatePickerModule
  ]
})
export class PoModule { }
