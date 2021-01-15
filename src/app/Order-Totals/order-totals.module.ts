import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WeekComponent } from './week/week.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/Shared.module';

import { OrderReportsComponent } from './order-reports/order-reports.component';

const routes: Routes = [
  {
    path: 'Search',data:{titleKey: 'Requitions'}, component: WeekComponent
  }
,
  { path: 'orderRpt', component: OrderReportsComponent}
];


@NgModule({
  declarations: [WeekComponent,OrderReportsComponent],
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
