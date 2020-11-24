import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
  displayBreadcrumbList: Array<any>;
  route: string = '';
  initialUrl: string = '';
  masterBreadcrumbList: Array<any>;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setBreadcrumb()
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
