import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from "./Recipe/RecipeComponent";
import { SharedModule } from '../_shared/Shared.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'recipes', component: RecipeComponent, children: [{ path: 'edit', component: RecipeComponent }]
  }
];

@NgModule({
  declarations: [RecipeComponent],
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



