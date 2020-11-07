import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SuppliersComponent } from './MENU1/suppliers/suppliers.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './_shared/Shared.module';


@NgModule({
  declarations: [
    AppComponent,
    SuppliersComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
     RouterModule.forRoot([
      {
         path: 'suppliers',  component: SuppliersComponent,
         children:[
           {path:'edit',component:SuppliersComponent}
         ]
      }
   ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// 'component2/:id1/:id2', componen
// children: [
//   {path: '', redirectTo: 'tracks'}, ①
//   {path: 'tracks', component: ArtistTrackListComponent}, ②
//   {path: 'albums', component: ArtistAlbumListComponent}, ③
//   ]
