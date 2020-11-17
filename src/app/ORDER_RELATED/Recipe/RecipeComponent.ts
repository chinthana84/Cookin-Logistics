import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecipeGrid } from 'src/app/models/Grid/recipe-grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Recipe } from 'src/app/models/recipe.model';
import { IMyGrid, Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-order',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit,IMyGrid {
  edited: boolean = false;
  modelWrapper: Wrapper = {};
  modelRecipe: Recipe = {};


gridOption: GridOptions = {
  
  datas: {},
  GridClassInstance:new RecipeGrid()
};

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService
  ) {
    this.edited = true;
  }



  setPage(obj: SearchObject): void {
    obj.girdId = GridType.Recipe;
    obj.defaultSortColumnName = "RecipeId";
    this.http
      .post<GridOptions>(`${environment.APIEndpoint}/grid`,obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
      });
  }

  ngOnInit(): void {
    this.setPage({ pageNo: 1, searchColName: "" });

    this.http
      .get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
      .subscribe((data) => {
        this.modelWrapper = data;
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.modelRecipe = new Recipe();
        // this.model.Category = new Categories();
        // this.model.Supplier = new Supplier();
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
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
  }
  onSubmit(obj: Recipe) {
    try {
      this.http
        .post<any>(`${environment.APIEndpoint}/Recipe/Save`, obj, {})
        .subscribe((data) => {
          console.log(data);

          this.toastr.success("ssssssssss");


          this.commonService.redirectTo('recipes');



        }, err => {
          this.confirmDialogService.messageBox(err.Message);

        });
    } catch (Error) {
      this.confirmDialogService.messageBox("data saved");

    }
  }

}
