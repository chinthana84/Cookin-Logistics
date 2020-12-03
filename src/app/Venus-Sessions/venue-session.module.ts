import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueComponent } from './venue/venue.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'venue',  component: VenueComponent , children: [{ path: 'edit', component: VenueComponent }]
  }
 ];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    //NgbModule,
    RouterModule.forChild(routes),
  ]
})
export class VenueSessionModule { }
