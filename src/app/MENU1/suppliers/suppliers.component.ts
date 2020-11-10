import { Component, OnInit } from '@angular/core';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { ActivatedRoute, Route, NavigationEnd, Router, Params } from '@angular/router';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Supplier } from 'src/app/models/supplier.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { HttpClient } from '@angular/common/http';

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

  // pieces: Supplier[] = [
  //   {
  //     "Company_Name": "naimal",
  //     "Contact_Name" :"xxx",
  //     "Supplier_ID": 1,
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal",
  //     "Supplier_ID": 2,
  //     "Contact_Name" :"xxx",
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal",
  //     "Supplier_ID": 3, "Contact_Name" :"xxx",
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal",
  //     "Supplier_ID": 4, "Contact_Name" :"xxx",
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimall",
  //     "Supplier_ID": 5, "Contact_Name" :"xxx",
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal",
  //     "Supplier_ID": 6, "Contact_Name" :"xxx",
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal",
  //     "Supplier_ID": 7,
  //     "Contact_Title": "MR", "Contact_Name" :"xxx",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimall", "Contact_Name" :"xxx",
  //     "Supplier_ID": 8,
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "naimal", "Contact_Name" :"xxx",
  //     "Supplier_ID": 9,
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   },
  //   {
  //     "Company_Name": "namel", "Contact_Name" :"xxx",
  //     "Supplier_ID": 10,
  //     "Contact_Title": "MR",
  //     "Phone": "2548",
  //     "Fax": "11111111111"
  //   } 

  // ];

  constructor(private http: HttpClient,private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private confirmDialogService: ConfirmDialogService
  ) {


    this.edited = false
  }




  ngOnInit() {
    this.setPage({ pageNo: 1, searchColName: '' });

    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params.id); // { order: "popular" }

      if (params.id == 0) {
        this.edited = true

        this.model = new Supplier()
      }
      else if (params.id > 0) {
        this.edited = true
        //'this.model = this.pieces.filter(i => i.Supplier_ID == params.id)[0]
        console.log(this.model)
      }
      else {
        this.edited = false
      }

    }
    );



  }

  setPage(obj: SearchObject) {
    // obj.girdId = GridType.Category;
    obj.defaultSortColumnName = 'Company_Name';

    this.http.post<any>('http://localhost:9999/api/grid',obj,{}).subscribe(data => {
      console.log(data);
      this.gridOption.datas=data;
  })

    // this.gridOption.datas = {
    //   "totalItems": 11,
    //   "currentPage": 1,
    //   "pageSize": 10.0,
    //   "totalPages": 1,
    //   "startPage": 1,
    //   "endPage": 1,
    //   "startIndex": 0,
    //   "endIndex": 6,
    //   "pagedItems": this.pieces,
    //   "pages": [
    //     1
    //   ]
    // };

  }

  Supplier(item: Supplier) {
    if (item == undefined) {
      this.router.navigate(['/suppliers/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/suppliers/edit'], { queryParams: { id: item.Supplier_ID } });
    }
    this.edited = true
     
  }



  onSubmit(form: Supplier) {
    this.toastr.success("ssssssssss")
    console.log(form)
    this.confirmDialogService.messageBox("data saved")
    // this.confirmDialogService.confirmThis("Are you sure to delete?", function () {  
    //   alert("Yes clicked");  
    // }, function () {  
    //   alert("No clicked");  
    // })  
       this.router.navigate(['/suppliers'] );
  }


}
