import { Order } from './order.model';
import { Product } from './product.model';
import { RefTable } from './reftable.model';

export class Recipe {

  public  RecipeId?:number=0;
  public  RecipeName?:string;
  public  StandardPortions?:number=0;
  public  ReqPortions?:number=0;
  public  YieldNumber?:number=0;
  public  YieldUnitId?:number=0;
  public  StandradUnitId?:number=0;
  public  PortionSize?:number=0;
  public  PortionUnit?:string=""
  public  Method?:string=""
  public  CourseId?:number=0;
  public  CuisineId?:number=0;
  public  PrepId ?:number=0;
  public  Reference?:string=""

  public  Mocid?:number=0;

  public   KitchRec?:boolean=false;
  public   BarRec?:boolean=false;
  public   MainIngredId?:number=0;

  public    Course?:RefTable

  public     Cuisine?:RefTable
  public     Moc?:RefTable
  public     Prep  ?:RefTable

  public   StandradUnit?:RefTable;
  public   YieldUnit?:RefTable;

  public   RecipeDetails?: RecipeDetailsDTO[];
  public   RecipeOrderLink?: RecipeOrderLinkDTO[]=[];


  //Addtional properties
  public SelectedYieldUnit?:string=""

}

export class   RecipeDetailsDTO {
  RecipeDetailId?: number=0;
  RecipeId?: number=0;
  ProductId?: number=0;
  Quantity?: number=0;
  Qpportion?: number=0;
  Yield?: number=0;
  RequiredQuantity?: number=0;
  ProdNote?: string="";
  UnitPrice:number=0;
  ProdUnitId:number=0;
  guid?:string=""

  public   Product?:Product;
}

export class RecipeOrderLinkDTO
{
    public  ROLinkId?: number=0;
    public  RecipeId?: number=0;
    public  OrderId?: number=0;
    public  NumReq?: number=0;
    public  CalcNote?: string="";


    public    Order?:Order={}
    public     Recipe ?:Recipe={}

}
