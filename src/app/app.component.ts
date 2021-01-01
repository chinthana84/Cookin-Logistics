import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './MyServices/authentication.service';
import * as $ from 'jquery'
import { SecurityModel } from './models/Security.model';
import { CommonService } from './_shared/_services/common.service';
import { CheckboxControlValueAccessor } from '@angular/forms';


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


constructor(private router: Router,private authentication: AuthenticationService,
  public commonServie:CommonService) {

}
isLoggedIn : Observable<boolean>;

securityModel: SecurityModel;

currentObj: SecurityModel

ngOnInit(): void {

  this.setBreadcrumb();
  if  ( this.securityModel == undefined){
    this.securityModel=new SecurityModel();
   let u = localStorage.getItem("username")
   let pw = localStorage.getItem("pw")
   if (u !=null){
    this.commonServie.Login({ UserName:u, Password:pw}).subscribe(r=>{  });
   }

  }
  else{
  this.securityModel= this.commonServie.securityModel;
  }


  this.commonServie.currentSecurityObject.subscribe(r=> {
    this.currentObj=r;

  });


   $(document).ready(function () {
    // $("#sidebar").mCustomScrollbar({
    //     theme: "minimal"
    // });


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
  });


}

getUsername(){
  return localStorage.getItem("username")
}

CheckAccess(path:string){

  if (path==="suppliers" && this.currentObj.Supplier==true){
    return "suppliers";
  }
  else if(path=="category" && this.currentObj.Category==true)
  {
    return "category";
  }
  else if(path=="products" && this.currentObj.Product==true){
    return "products";
  }
  else if(path=="recipes" && this.currentObj.Recipe==true){
    return "recipes";
  }
  else if(path=="orders" && this.currentObj.Order==true){
    return "orders";
  }
  else if(path=="tutor" && this.currentObj.Tutor==true){
    return "tutor";
  }
  else if(path=="venue" && this.currentObj.Venue==true){
    return "venue";
  }
  else if(path=="classes" && this.currentObj.Classs==true){
    return "classes";
  }
  else if(path=="units" && this.currentObj.Unit==true){
    return "units";
  }
   else if(path=="Search" && this.currentObj.Weeks==true){
    return "Search";
  }
   else if(path=="changepw" && this.currentObj.ChangePW==true){
    return "changepw";
  }
   else if(path=="admin" && this.currentObj.UserAccess==true){
    return "admin";
  }
  else if(path=="quli" && this.currentObj.Qulification==true){
    return "quli";
  }
  else if(path=="ref" && this.currentObj.Reference==true){
    return "ref";
  }
 else{
    return "home";
  }


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
