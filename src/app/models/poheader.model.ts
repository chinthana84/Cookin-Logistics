export class PoHeaer {


  public  Poid ?: number=0;
  public  Pono?:string=""
  public  SupplierId?: number=0;
  public  PaymentTermId ?: number=0;
  public  DeliveryDate? : Date;
  public  OrderedById ?: number=0;
  public  Remarks ?:string=""
  public  Podetails?: Podetails[];
}

export class Podetails
{
    public  PodetailId ?: number=0;
    public  Poid?: number=0;
    public  ProductId ?: number=0;
    public  ProdUnitId ?: number=0;
    public  Qty ?: number=0;
    public  UnitPrice?: number=0;

    public guid?:string="";
    public ProductDescription?:string="";
    public ProductUnitDescription?:string=""

}
