import { RefTable } from './reftable.model';

export class Recipe {

  public  RecipeId?:number=0;
  public  RecipeName?:string;
  public  StandardPortions?:number=0;
  public  ReqPortions?:number=0;
  public  YieldNumber?:number=0;
  public  YieldUnit?:string=""
  public  PortionSize?:number=0;
  public  PortionUnit?:string=""
  public  Method?:string=""
  public  CourseId?:number=0;
  public  CuisineId?:number=0;
  public  PrepId ?:number=0;
  public  Reference?:string=""
  public  StdUnits?:string=""
  public  Mocid?:number=0;

  public   KitchRec?:boolean=false;
  public   BarRec?:boolean=false;
  public   MainIngredId?:number=0;

  public    Course?:RefTable

  public     Cuisine?:RefTable
  public     Moc?:RefTable
  public     Prep  ?:RefTable

}
