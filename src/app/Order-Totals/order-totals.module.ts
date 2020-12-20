import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WeekComponent } from './week/week.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/Shared.module';

const routes: Routes = [
  {
    path: 'Search', component: WeekComponent
  }
];


@NgModule({
  declarations: [WeekComponent],
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
