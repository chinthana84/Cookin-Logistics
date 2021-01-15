import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TutorComponent } from './tutor/tutor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/Shared.module';

const routes: Routes = [
  {
    path: 'tutor',data:{titleKey: 'Tutor'}, component: TutorComponent
    , children: [{ path: 'edit', component: TutorComponent }]
  }
];


@NgModule({
  declarations: [TutorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class TutorsTimetableModule { }
