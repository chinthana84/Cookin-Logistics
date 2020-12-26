import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './MyServices/authentication.service';
import * as $ from 'jquery'
import { SecurityModel } from './models/Security.model';
import { CommonService } from './_shared/_services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cookin-Logistics';

  displayBreadcrumbList: Array<any>;
  route: string = '';
  initialUrl: string = '';
  masterBreadcrumbList: Array<any>;

isLogged$:BehaviorSubject<boolean>;


constructor(private router: Router,private authentication: AuthenticationService,private commonServie:CommonService) {

}
isLoggedIn : Observable<boolean>;

securityModel: SecurityModel;

currentObj: SecurityModel

ngOnInit(): void {

  this.setBreadcrumb();
  if  ( this.securityModel == undefined){
    this.securityModel=new SecurityModel();
    this.commonServie.Login({ UserName: "admin", Password: "123456" }).subscribe(r=>{


    });
  }
  else{
  this.securityModel= this.commonServie.securityModel;
  }




  this.commonServie.currentSecurityObject.subscribe(r=> {
    this.currentObj=r;
  })

  // this.isLoggedIn = this.authentication.isLoggedIn();

  // this.authentication.isLoggedIn().subscribe(r=> {
  //   if (r == false){
  //     this.router.navigate(['login']);
  //   }

  // })

  // $(document).ready(function () {
    // $("#sidebar").mCustomScrollbar({
    //     theme: "minimal"
    // });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
// });


}

setBreadcrumb() {
  this.router.events.subscribe((val) => {
this.displayBreadcrumbList = [];
if (location.pathname !== '') {
 this.route = location.pathname;
 this.masterBreadcrumbList = this.route.split('/');
 this.masterBreadcrumbList = this.masterBreadcrumbList.slice(1, this.masterBreadcrumbList.length);
 for (let i = 0; i < this.masterBreadcrumbList.length; i++) {
   if (i !== 0) {
     this.initialUrl = this.displayBreadcrumbList[i - 1];
   } else {
     this.initialUrl = '/';
   }
   const breadCrumbObj = {
     name: this.masterBreadcrumbList[i],
     url: this.initialUrl + this.masterBreadcrumbList[i],
     id: i
   };
   this.displayBreadcrumbList.push(breadCrumbObj);
 }
} else {
 this.route = 'Home';
}

});
}




}
