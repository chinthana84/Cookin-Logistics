import { filter } from 'rxjs/operators';
import { TypeheadService } from './../../_shared/_services/typehead.service';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { RecipeGrid } from 'src/app/models/Grid/recipe-grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Recipe, RecipeDetailsDTO, RecipeOrderLinkDTO } from 'src/app/models/recipe.model';
import { RefTable } from 'src/app/models/reftable.model';
import { TypeHeadSearchDTO } from 'src/app/models/typeheadSearchDTO.model';
import { IMyGrid, Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { MyproductServiceService } from 'src/app/_shared/product-dialog/myproduct-service.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  private subs = new SubSink();
  edited: boolean = false;
  modelWrapper: Wrapper = {};
  modelRecipe: Recipe = {};
  modelOrders: Order[] = [];
  public workingRecipeDetID: number = 0;
  @Input() recipeIDFromMain: number = 0;

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


  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;



  constructor(
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService,
    private gridService: GridService,
    public myproductServiceService: MyproductServiceService,
    private typeheadService: TypeheadService
  ) {
    this.edited = true;
  }

  ngOnInit(): void {

    this.setPage(this.gridOption.searchObject);

    if (this.recipeIDFromMain > 0) {
      this.edited = true;
      let a = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetByID/` + this.recipeIDFromMain);
      let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
      let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

      this.subs.sink = forkJoin([a, b, c]).subscribe(results => {
        this.modelRecipe = results[0]
        this.modelWrapper = results[1];
        this.modelOrders = results[2]
        this.onChangeYieldUnit();

      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
    }
    else {

      this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

        if (params.id == 0) {
          this.edited = true;
          this.modelRecipe = new Recipe();
          this.modelRecipe.RecipeDetails = []
          this.model = {};

          let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
          let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

          this.subs.sink = forkJoin([b, c]).subscribe(results => {
            this.modelWrapper = results[0];
            this.modelOrders = results[1]
            this.onChangeYieldUnit();


          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });

        } else if (params.id > 0) {
          this.edited = true;
          this.model = {};
          let a = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetByID/` + params.id);
          let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
          let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

          this.subs.sink = forkJoin([a, b, c]).subscribe(results => {
            this.modelRecipe = results[0]
            this.modelWrapper = results[1];
            this.modelOrders = results[2]
            this.onChangeYieldUnit();

          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
        } else {
          this.edited = false;
        }
      });
    }

    this.subs.sink = this.myproductServiceService.getSelectedProduct().subscribe(message => {

      this.AddRecipeLine(message);
    });

  }

  setPage(obj: SearchObject): void {
    this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }


  getUnit(id: number): string {
    var p = this.modelWrapper.Products.filter(p => p.ProductId == id)[0];
    return "";
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

  PortionSize(): string {
    let val: number
    val = (this.modelRecipe.YieldNumber / this.modelRecipe.StandardPortions);
    if (isNaN(val)) {
      return '0';
    }
    else {
      return val.toFixed(2);
    }
  }

  RequiredYield(): string {
    var x = (this.modelRecipe.ReqPortions * this.modelRecipe.YieldNumber);
    return isNaN(x / this.modelRecipe.StandardPortions) ? '0' : (x / this.modelRecipe.StandardPortions).toFixed(2);

  }

  unitPriceDefaultValues(val: any, obj: RecipeDetailsDTO) {

    if (val === 0 || val === null || val === undefined) {
      let objProd = this.getProductObject(obj.ProductId)
      obj.UnitPrice = objProd.UnitPrice
    }
    else {
      obj.UnitPrice = val;
    }
  }


  unitIDDefaultValues(val: any, obj: RecipeDetailsDTO) {
    obj.ProdUnitId = 0;
    if (obj.ProdUnitId === 0 || obj.ProdUnitId === null || obj.ProdUnitId === undefined) {
      let objProd = this.getProductObject(obj.ProductId)
      obj.ProdUnitId = objProd.ProdUnit.RefId;
      obj.UnitPrice = objProd.UnitPrice;
    }
    else {
      obj.ProdUnitId = val;
    }
  }

  onSubmit(obj: Recipe) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Recipe/Save`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          if (this.recipeIDFromMain == 0) {
            this.router.navigate(['recipes']);
            this.setPage(this.gridOption.searchObject);
          }
          else {
            this.commonService.Saved();
          }
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

  public onChangeYieldUnit(): void {

    let x = this.modelWrapper.YieldUnits.filter(b => b.RefId == this.modelRecipe.YieldUnitId)

    if (x[0] == undefined) {

      this.modelRecipe.SelectedYieldUnit = "NO";
    } else {
      this.modelRecipe.SelectedYieldUnit = x[0].RefDescription;

    }
  }



  public AddAssosiatedOrders(): void {
    var obj = new RecipeOrderLinkDTO();
    obj.RecipeId = this.modelRecipe.RecipeId;


    if (this.modelRecipe.RecipeOrderLink == undefined) {
      this.modelRecipe.RecipeOrderLink = [];
    }

    this.modelRecipe.RecipeOrderLink.push(obj);
  }


  getProductObject(i: number): Product {
    let x = this.modelWrapper.Products.filter(b => b.ProductId == i)
    return x[0];
  }

  deleteRecipeDetails(i: number, guid: string): void {

    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      if (i > 0) {
        this.modelRecipe.RecipeDetails = this.modelRecipe.RecipeDetails.filter(item => item.RecipeDetailId != i);
      }
      else {
        this.modelRecipe.RecipeDetails = this.modelRecipe.RecipeDetails.
          filter(item => item.guid != guid);
      }

    },
      function () { })

  }

  deleteLinkOrder(i: number) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.modelRecipe.RecipeOrderLink = this.modelRecipe.RecipeOrderLink.filter(item => item.OrderId != i);
    },
      function () { })
  }

  ViewReport() {
    alert('not implemnted')
  }

  public AddRecipeLine(obj_pro: Product): void {

    var obj = new RecipeDetailsDTO();
    obj.RecipeId = this.modelRecipe.RecipeId;

    if (this.workingRecipeDetID > 0) {

      let obj = this.modelRecipe.RecipeDetails
        .filter(item => item.RecipeDetailId == this.workingRecipeDetID)[0]
      obj.Product = obj_pro;
      obj.RecipeId = this.modelRecipe.RecipeId;
      obj.ProductId = obj_pro.ProductId;
      obj.UnitPrice = obj_pro.UnitPrice;
      obj.ProdUnitId = obj_pro.ProdUnitId;

    } else {

      obj.Product = obj_pro;
      obj.ProductId = obj_pro.ProductId;
      obj.UnitPrice = obj_pro.UnitPrice;
      obj.ProdUnitId = obj_pro.ProdUnitId;
      obj.guid = this.commonService.newGuid();
      this.modelRecipe.RecipeDetails.push(obj);
    }
  }



  AddProdutDialog(prod_id: number, recipe_det_id: number) {
    this.workingRecipeDetID = recipe_det_id;
    this.myproductServiceService.ProductPopup(this.modelWrapper, prod_id, 0);
  }


  searchItems = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      filter(r => r.length > 3),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.typeheadService.TypeHeadSearch(term, 1)
          .pipe(
            tap(() => {
              this.searchFailed = false;
            }),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )

  selectedItem(ID: any) {

    let id = this.activatedRoute.snapshot.queryParams["id"];
    if (id == "0") {


      let a = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetByID/` + ID.item.ID);
      let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
      let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

      this.subs.sink = forkJoin([a, b, c]).subscribe(results => {
        
        let id = this.activatedRoute.snapshot.queryParams["id"];


        this.modelRecipe = results[0]
        this.modelWrapper = results[1];
        this.modelOrders = results[2]
        this.onChangeYieldUnit();
        if (id == "0") {
          this.modelRecipe.RecipeId = 0;
        }


      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
    }
    else {
      this.router.navigate(["/recipes/edit"], { queryParams: { id: ID.item.ID } });
    }


  }


}



