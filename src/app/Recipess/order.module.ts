import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from "./Recipe/RecipeComponent";
import { SharedModule } from '../_shared/Shared.module';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order/order.component';

import { RecipeOrderReportsComponent } from './recipe-order-reports/recipe-order-reports.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';


const routes: Routes = [
  {
    path: 'recipes',data:{titleKey: 'Recipes'}, component: RecipeComponent
    , children: [{ path: 'edit', component: RecipeComponent }]
  },
   {
    path: 'orders',data:{titleKey: 'Orders'}, component: OrderComponent
    , children: [{ path: 'edit', component: OrderComponent }]

  },
  { path: 'RecipeOrderRPT', component: RecipeOrderReportsComponent}
];

@NgModule({
  declarations: [RecipeComponent,OrderComponent,    RecipeOrderReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    VirtualScrollerModule
  ],

  exports: [RecipeComponent,OrderComponent]
})
  export class OrderModule { }



