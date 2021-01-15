import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassesComponent } from './classes/classes.component';
import { SharedModule } from '../_shared/Shared.module';
import { UnitsComponent } from './units/units.component';
import { QulificatonComponent } from './qulificaton/qulificaton.component';

const routes: Routes = [
  {
    path: 'classes',data:{titleKey: 'Classes'},  component: ClassesComponent , children: [{ path: 'edit', component: ClassesComponent }]
  },
  {
    path: 'units',data:{titleKey: 'Units'},  component: UnitsComponent , children: [{ path: 'edit', component: UnitsComponent }]
  }
  ,
  {
    path: 'quli',data:{titleKey: 'Qulifications'},  component: QulificatonComponent , children: [{ path: 'edit', component: QulificatonComponent }]
  }
 ];


@NgModule({
  declarations: [ ClassesComponent, UnitsComponent, QulificatonComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    //NgbModule,
    RouterModule.forChild(routes),
  ]
})
export class QuliClassUniModule { }
