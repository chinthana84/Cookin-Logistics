import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Categories } from 'src/app/models/categories.model';
import { GridType } from 'src/app/models/gridType.enum';
import { IMyGrid } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit,IMyGrid {
  edited: boolean = false

  gridOption: GridOptions = {
    datas: {},
    GridClassInstance: new Categories()
  };

 constructor( config: NgbCarouselConfig,   private commonService:CommonService,private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private confirmDialogService: ConfirmDialogService
  ) {


    this.edited = false
  }

  ngOnInit(): void {
    this.setPage({ pageNo: 1, searchColName: '' });
  }

  setPage(obj: SearchObject) {
    obj.girdId = GridType.Category;
    obj.defaultSortColumnName = 'CategoryName';

    this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {}).subscribe(data => {
      console.log(data);
      this.gridOption.datas = data;
    })

  }

  Action(obj : Categories)
  {
    if (obj == undefined) {
      this.router.navigate(['/category/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/category/edit'], { queryParams: { id: obj.CategoryId } });
    }
    this.edited = true
  }

}
