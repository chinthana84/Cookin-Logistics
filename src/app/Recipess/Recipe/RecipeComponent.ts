import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { RecipeGrid } from 'src/app/models/Grid/recipe-grid.model';
import { GridType } from 'src/app/models/gridType.enum';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Recipe, RecipeDetailsDTO, RecipeOrderLinkDTO } from 'src/app/models/recipe.model';
import { RefTable } from 'src/app/models/reftable.model';
import { IMyGrid, Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-order',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  private subs = new SubSink();
  edited: boolean = false;
  modelWrapper: Wrapper = {};
  modelRecipe: Recipe = {};
  modelOrders : Order[]=[];

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
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService,
    private gridService: GridService
  ) {
    this.edited = true;
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);



    this.subs.sink =   this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.modelRecipe = new Recipe();
        this.modelRecipe.RecipeDetails=[]

        let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
        let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

        this.subs.sink =   forkJoin([b,c]).subscribe(results => {
          this.modelWrapper = results[0];
          this.modelOrders=results[1]
          this.onChangeYieldUnit();


        });

      } else if (params.id > 0) {
        this.edited = true;
        let a = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetByID/` + params.id);
        let b = this.http.get<any>(`${environment.APIEndpoint}/Recipe/GetAllRefs`)
        let c = this.http.get<any>(`${environment.APIEndpoint}/Order/GetAllOrders`)

        this.subs.sink =   forkJoin([a, b,c]).subscribe(results => {
          this.modelRecipe = results[0]
          this.modelWrapper = results[1];
          this.modelOrders=results[2]
          this.onChangeYieldUnit();
          console.log(this.modelRecipe)
        });
      } else {
        this.edited = false;
      }
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
    let val:number
       val= (this.modelRecipe.YieldNumber / this.modelRecipe.StandardPortions);
    if (isNaN(val)){
      return '0';
    }
    else{
    return  val.toFixed(2) ;
  }
}

  RequiredYield(): string {
    var x = (this.modelRecipe.ReqPortions * this.modelRecipe.YieldNumber);
    return isNaN(x / this.modelRecipe.StandardPortions) ? '0' : (x / this.modelRecipe.StandardPortions).toFixed(2);

  }

  unitPriceDefaultValues(val :any,obj:RecipeDetailsDTO){

    if(val===0 || val === null || val === undefined){
      let objProd= this.getProductObject(obj.ProductId)
      obj.UnitPrice=objProd.UnitPrice
    }
    else{
      obj.UnitPrice=val;
    }
   }


   unitIDDefaultValues(val :any,obj:RecipeDetailsDTO){
    obj.ProdUnitId=0;
    if(obj.ProdUnitId===0 || obj.ProdUnitId === null || obj.ProdUnitId === undefined){
      let objProd= this.getProductObject(obj.ProductId)
      obj.ProdUnitId =objProd.ProdUnit.RefId;
      obj.UnitPrice=objProd.UnitPrice;
    }
    else{
      obj.ProdUnitId=val;
    }
   }

  onSubmit(obj: Recipe) {
    this.subs.sink =  this.http
      .post<any>(`${environment.APIEndpoint}/Recipe/Save`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['recipes']);
          this.setPage(this.gridOption.searchObject);
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

  public AddRecipeLine(): void {
    var obj = new RecipeDetailsDTO();
    obj.RecipeId = this.modelRecipe.RecipeId;
    this.modelRecipe.RecipeDetails.push(obj);
  }


  public AddAssosiatedOrders(): void {
    var obj = new RecipeOrderLinkDTO();
    obj.RecipeId = this.modelRecipe.RecipeId;
    console.log(this.modelRecipe.RecipeOrderLink)

    if(this.modelRecipe.RecipeOrderLink == undefined){
      this.modelRecipe.RecipeOrderLink=[];
    }

    this.modelRecipe.RecipeOrderLink.push(obj);
  }


  getProductObject(i: number): Product {
    let x = this.modelWrapper.Products.filter(b => b.ProductId == i)
    return x[0];
  }

  deleteRecipeDetails(i : number):void{
    this.modelRecipe.RecipeDetails = this.modelRecipe.RecipeDetails.filter(item => item.RecipeDetailId != i);
  }

  deleteLinkOrder(i:number){
    this.modelRecipe.RecipeOrderLink = this.modelRecipe.RecipeOrderLink.filter(item => item.OrderId != i);
  }

  ViewReport(){
    alert('not implemnted')
  }



}



