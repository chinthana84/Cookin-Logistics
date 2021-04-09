import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthenticationService } from "./MyServices/authentication.service";
import * as $ from "jquery";
import { SecurityModel } from "./models/Security.model";
import { CommonService } from "./_shared/_services/common.service";
import { CheckboxControlValueAccessor } from "@angular/forms";
import { OrderTotalReportTypes } from "./models/gridType.enum";
import { map } from "rxjs/operators";

// https://emilol.com/angular-2-breadcrumb-component/

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = "Cookin-Logistics";


  displayBreadcrumbList: Array<any>;
  route: string = "";
  initialUrl: string = "";
  masterBreadcrumbList: Array<any>;


  isLogged$: BehaviorSubject<boolean>;
  home: string = "home";
  constructor(
    private routeed: ActivatedRoute,
    private router: Router,
    private authentication: AuthenticationService,
    public commonServie: CommonService
  ) { }
  isLoggedIn: Observable<boolean>;

  securityModel: SecurityModel;

  currentObj: SecurityModel;

  ngOnInit(): void {


    this.setBreadcrumb();


    if (this.securityModel == undefined) {
      this.securityModel = new SecurityModel();
      let u = localStorage.getItem("username");
      let pw = localStorage.getItem("pw");
      if (u != null) {
        this.commonServie
          .Login({ UserName: u, Password: pw })
          .subscribe((r) => {
            this.currentObj = r;

            this.commonServie.currentSecurityObject.subscribe((r) => {
              this.currentObj = r;

              if (this.currentObj.IsAuthenticated === false) {
                this.router.navigate(["login"]);
              }
            });
          });
      }
    } else {
      this.securityModel = this.commonServie.securityModel;

      this.commonServie.currentSecurityObject.subscribe((r) => {
        this.currentObj = r;

        if (this.currentObj.IsAuthenticated === false) {
          this.router.navigate(["login"]);
        }
      });
    }

    this.commonServie.currentSecurityObject.subscribe((r) => {
      this.currentObj = r;
    });
  }

  ngAfterViewInit() {

  }

  CCCC() {
    $(document).ready(function () {
      // $("#sidebar").mCustomScrollbar({
      //     theme: "minimal"
      // });

      $("#sidebarCollapse").on("click", function () {
        $("#sidebar, #content").toggleClass("active");

        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");

        //  alert($('#sidebarCollapse').hasClass('active'))

        if ($("#logoImage").css("display") === "block") {
          $("#logoImage").css("display", "none");
        } else {
          $("#logoImage").css("display", "block");
        }
      });
    });
  }

  getUsername() {
    return localStorage.getItem("username");
  }

  CheckAccess(path: string) {
    if (path === "suppliers" && this.currentObj.Supplier == true) {
      return "suppliers";
    } else if (path == "category" && this.currentObj.Category == true) {
      return "category";
    } else if (path == "products" && this.currentObj.Product == true) {
      return "products";
    } else if (path == "recipes" && this.currentObj.Recipe == true) {
      return "recipes";
    } else if (path == "orders" && this.currentObj.Order == true) {
      return "orders";
    } else if (path == "tutor" && this.currentObj.Tutor == true) {
      return "tutor";
    } else if (path == "venue" && this.currentObj.Venue == true) {
      return "venue";
    } else if (path == "classes" && this.currentObj.Classs == true) {
      return "classes";
    } else if (path == "units" && this.currentObj.Unit == true) {
      return "units";
    } else if (path == "Search" && this.currentObj.Weeks == true) {
      return "Search";
    } else if (path == "changepw" && this.currentObj.ChangePW == true) {
      return "changepw";
    } else if (path == "admin" && this.currentObj.UserAccess == true) {
      return "admin";
    } else if (path == "quli" && this.currentObj.Qulification == true) {
      return "quli";
    } else if (path == "ref" && this.currentObj.Reference == true) {
      return "ref";
    } else {
      return "home";
    }
  }

  setBreadcrumb() {

    this.router.events.subscribe((routeEvent: RoutesRecognized) => {
     if (!(routeEvent instanceof RoutesRecognized)) return;
      // this.router.events.subscribe((val) => {



      let route = routeEvent.state.root;
      let dispayname: string = ""
      dispayname = route.firstChild.data["titleKey"]

      if (dispayname==undefined){

        if (route.queryParams.rptUI_ID==undefined){
          dispayname="name not found"
        }else{
        dispayname=this.ReportsUIs.filter(r=> r.ID== route.queryParams.rptUI_ID)[0].Name
        }
      }


        this.displayBreadcrumbList = [];
        if (routeEvent.url !== "") {
        //  this.route = location.pathname;
        this.route = routeEvent.url;
          this.masterBreadcrumbList = this.route.split("/");
          this.masterBreadcrumbList = this.masterBreadcrumbList.slice(
            1,
            this.masterBreadcrumbList.length
          );


          // for (let i = 0; i < this.masterBreadcrumbList.length; i++) {
            for (let i = 0; i < 1; i++) {

            if (this.masterBreadcrumbList[i] != 'pro' && this.masterBreadcrumbList[i] != 'edit') {
              if (i !== 0) {
                this.initialUrl = this.displayBreadcrumbList[i - 1];
              } else {
                this.initialUrl = "/";
              }

              if (this.initialUrl == undefined) {
                this.initialUrl = "";
              }

              const breadCrumbObj = {
                name:  dispayname,
                url: this.initialUrl + this.masterBreadcrumbList[i],
                id: i,
              };

              this.displayBreadcrumbList.push(breadCrumbObj);
            }

          }
        } else {
          this.route = "/Home";
        }


    });
  }

  decodeurl(url:string){
   if (url.indexOf("&") >0 ){
    return
   }
   else
   {
    this.router.navigate([url])
   }


  }

  logout(){
    localStorage.removeItem("todoBearerToken");

    localStorage.removeItem("refreshToken");
    localStorage.removeItem( "username" )

    localStorage.removeItem("pw");
    this.router.navigate(['login']);
  }


  ReportsUIs = [
     { "ID": "900", "Name": "Order Breakdown by Category" }
,    { "ID": "901", "Name": "Breakdown of all-venue/all-class" }
,    { "ID": "902", "Name": "Order Single Supplier" }
,    { "ID": "903", "Name": "Order Single Class" }
,    { "ID": "904", "Name": "Order Single Category" }
,    { "ID": "905", "Name": "Order Single Venue" }
,    { "ID": "1000", "Name": "Calculate Commodities Trolly" }
,    { "ID": "2000", "Name": "Venue Time Table" }
,    { "ID": "2001", "Name": "Class Time Table" }
,    { "ID": "2002", "Name": "Tutor Time Table" }
  ];

}




