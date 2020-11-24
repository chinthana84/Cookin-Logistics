import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../MyServices/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  displayBreadcrumbList: Array<any>;
  route: string = '';
  initialUrl: string = '';
  masterBreadcrumbList: Array<any>;

isLogged$:BehaviorSubject<boolean>;
  constructor(private router: Router,private authentication: AuthenticationService) { }
  isLoggedIn : Observable<boolean>;




  ngOnInit(): void {
    this.setBreadcrumb();
    this.isLoggedIn = this.authentication.isLoggedIn();

    this.authentication.isLoggedIn().subscribe(r=> {
      if (r == false){
        this.router.navigate(['login']);
      }

    })




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
