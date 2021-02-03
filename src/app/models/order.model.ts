import { Product } from './product.model';
import { RecipeOrderLinkDTO } from './recipe.model';

export class Order {
  public   OrderId?: number=0;
  public OrderDescription?:string="";
  public   StudentNumbers?:number=0;
  public   ReqStudentNumbers?:number=0;
  public   PractTitle?:string=""
  public   IsAssessment ?:Boolean=false;
  public   IsService?:Boolean=false;
  public   IsTheory?:Boolean=false;
  public   IsPractical?:Boolean=false;

  public    Notes ?:string="";
  public    RecipeOrderLink?:RecipeOrderLinkDTO[];
  public   OrderDetails?: OrderDetails[];
  public   OrderTheoryNotes?: OrderTheoryNotesDTO []=[];
}

export class OrderDetails
{
    public   OrderDetailsId?: number=0;
    public   OrderId ?: number=0;
    public   ProductId?: number=0;
    public   Quantity  : number=0;
    public   Qps?: number=0;
    public   Discount?: number=0;
    public   Yield ?: number=0;
    public   RequiredQuantity ?: number=0;

    public   Order?: Order;
    public   Product?: Product;

    public ProdUnitId ?: number=0;
    public  UnitPrice  : number=0;

    public guid?:string=''
}

export   class OrderTheoryNotesDTO
{
    public   TheoryNoteId ?: number=0;
    public   OrderId ?: number=0;
    public   TherNoteTitle ?: string='';
    public   Notes ?: string='';
    public   UniqueFileName?:string="";

}
