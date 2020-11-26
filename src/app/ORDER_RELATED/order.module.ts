import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from "./Recipe/RecipeComponent";
import { SharedModule } from '../_shared/Shared.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'recipes',  component: RecipeComponent,  children:[{path:'edit',component:RecipeComponent}]
  }
 ];

@NgModule({
  declarations: [RecipeComponent],
  imports: [

    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports:[RecipeComponent]
})
export class OrderModule { }



