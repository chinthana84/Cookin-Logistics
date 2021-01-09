import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WeekComponent } from './week/week.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/Shared.module';
import { OrderComponent } from './order/order/order.component';
import { OrderReportsComponent } from './order-reports/order-reports.component';

const routes: Routes = [
  {
    path: 'Search', component: WeekComponent
  }
 , {
    path: 'orders', component: OrderComponent
    , children: [{ path: 'edit', component: OrderComponent }]

  },
  { path: 'orderRpt', component: OrderReportsComponent}
];


@NgModule({
  declarations: [WeekComponent,OrderComponent,OrderReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [WeekComponent]
})
export class OrderTotalsModule { }
