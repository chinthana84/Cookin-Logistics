import { Component, OnInit } from '@angular/core';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { ActivatedRoute, Route, NavigationEnd, Router, Params } from '@angular/router';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Supplier } from 'src/app/models/supplier.model';   
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  searchID = 1;
  model: Supplier = {};
  edited: boolean = false

  searchObject: SearchObject = {};
  gridOption: GridOptions = {
    colNames: [{ colName: 'ID' }, { colName: 'Name' }],
    datas: {}
  };



  constructor(private router: Router, private activatedRoute: ActivatedRoute,private toastr: ToastrService
      ) {

   
    this.edited = false
  }

  displayBreadcrumbList: Array<any>;
  route: string = '';
  initialUrl: string = '';
  masterBreadcrumbList: Array<any>;


  ngOnInit() {
    this.setPage({ pageNo: 1, searchColName: '' });

    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params.id); // { order: "popular" }

      if (params.id >= 0) {
        this.edited = true

        let p: Supplier[]  = [
          {
            "Company_Name": "ABC Mung Bean Drink 250ml",
            "Supplier_ID":2
          },
          {
            "Company_Name": "ABC Mung Bean Drink 250ml",
            "Supplier_ID":1
          }
    
        ];

        this.model=p[0]
      }
      else {
        this.edited = false
      }

    }
    );

    this.setBreadcrumb()

  }

  setPage(obj: SearchObject) {
    // obj.girdId = GridType.Category;
    //obj.defaultSortColumnName = 'Description';
    let pieces: Supplier[]  = [
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":2
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      },
      {
        "Company_Name": "ABC Mung Bean Drink 250ml",
        "Supplier_ID":1
      }

    ];


     
 

    this.gridOption.datas = {
      "totalItems": 11,
      "currentPage": 1,
      "pageSize": 10.0,
      "totalPages": 1,
      "startPage": 1,
      "endPage": 1,
      "startIndex": 0,
      "endIndex": 6,
      "pagedItems": pieces,
      "pages": [
        1
      ]
    };

  }

  Supplier(item: Supplier) {
    if (item == undefined){
      this.router.navigate(['/suppliers/edit'], { queryParams: { id: 0 } });
    }
    else{
    this.router.navigate(['/suppliers/edit'], { queryParams: { id: item.Supplier_ID } });
    }
    this.edited = true
    this.setBreadcrumb()
  }

  setBreadcrumb() {
    //   this.router.events.subscribe((val) => {
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
    console.log(this.displayBreadcrumbList)
    // });
  }

  onSubmit(form: Supplier) { 
    this.toastr.success("ssssssssss")
    console.log(form)

    // this.confirmDialogService.confirmThis("Are you sure to delete?", function () {  
    //   alert("Yes clicked");  
    // }, function () {  
    //   alert("No clicked");  
    // })  
  //  this.router.navigate(['/suppliers'] );
  }
  

}
