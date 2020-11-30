import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from "./Recipe/RecipeComponent";
import { SharedModule } from '../_shared/Shared.module';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order/order.component';

const routes: Routes = [
  {
    path: 'recipes', component: RecipeComponent
    , children: [{ path: 'edit', component: RecipeComponent }]
  },
  {
    path: 'orders', component: OrderComponent
    , children: [{ path: 'edit', component: OrderComponent }]

  }
];

@NgModule({
  declarations: [RecipeComponent, OrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RecipeComponent]
})
  export class OrderModule { }



