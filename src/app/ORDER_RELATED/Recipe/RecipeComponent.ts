import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { RecipeGrid } from 'src/app/models/Grid/recipe-grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Recipe } from 'src/app/models/recipe.model';
import { IMyGrid, Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-order',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  edited: boolean = false;
  modelWrapper: Wrapper = {};
  modelRecipe: Recipe = {};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Recipe
      , defaultSortColumnName: "RecipeName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "RecipeName", colText: 'Recipe Name' },
      { colName: "CourseName", colText: 'Course' },
      { colName: "CuisineName", colText: 'CuisineName Name' },
      { colName: "MocName", colText: 'MOC Name' },
      { colName: "PrepName", colText: 'Pre Name' }
      ]
    }
  };



  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService,
    private gridService : GridService
  ) {
    this.edited = true;
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.http
      .get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
      .subscribe((data) => {
        this.modelWrapper = data;
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.modelRecipe = new Recipe();
      } else if (params.id > 0) {
        this.edited = true;
        this.http
          .get<any>(
            `${environment.APIEndpoint}/Recipe/GetByID/` + params.id
          )
          .subscribe((data) => {
            this.modelRecipe = data;
            console.log(data);
          });
      } else {
        this.edited = false;
      }
    });

  }

  setPage(obj: SearchObject): void {
    this.gridService.getGridData(obj).subscribe((data) =>{
      this.gridOption.datas = data;
    }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
    });
 }

  Action(obj: Recipe) {
    if (obj == undefined) {
      this.router.navigate(["/recipes/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/recipes/edit"], {
        queryParams: { id: obj.RecipeId },
      });
    }
    this.edited = true;
  }

  onSubmit(obj: Recipe) {
    try {
      this.http
        .post<any>(`${environment.APIEndpoint}/Recipe/Save`, obj, {})
        .subscribe((data) => {
          this.toastr.success("ssssssssss");

          this.router.navigate(['products']);
          this.setPage(this.gridOption.searchObject);

        }, err => {
          this.confirmDialogService.messageBox(err.Message);

        });
    } catch (Error) {
      this.confirmDialogService.messageBox("data saved");
    }
  }

}
