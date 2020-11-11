import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  edited: boolean = false

  searchObject: SearchObject = {};
  gridOption: GridOptions = {
    colNames: [{ colName: 'Company_Name' }],
    datas: {}
  };
 
 constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private confirmDialogService: ConfirmDialogService
  ) {


    this.edited = false
  }

  ngOnInit(): void {
    this.setPage({ pageNo: 1, searchColName: '' });
  }

  setPage(obj: SearchObject) {
    obj.girdId = GridType.Category;
    obj.defaultSortColumnName = 'CategoryName';

    this.http.post<any>('http://localhost:9999/api/grid', obj, {}).subscribe(data => {
      console.log(data);
      this.gridOption.datas = data;
    })

  }

}
