import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassesComponent } from './classes/classes.component';
import { SharedModule } from '../_shared/Shared.module';
import { UnitsComponent } from './units/units.component';

const routes: Routes = [
  {
    path: 'classes',  component: ClassesComponent , children: [{ path: 'edit', component: ClassesComponent }]
  },
  {
    path: 'units',  component: UnitsComponent , children: [{ path: 'edit', component: UnitsComponent }]
  }
 ];


@NgModule({
  declarations: [ ClassesComponent, UnitsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    //NgbModule,
    RouterModule.forChild(routes),
  ]
})
export class QuliClassUniModule { }
