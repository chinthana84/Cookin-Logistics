export class ProductGridDTO
{
  public  ProductId?: string=""
  public  ProductName?: string=""
  public  CompanyName?: string=""
  public  CategoryName?: string=""
  public  ContactName?: string=""
}

export   class OrdersGridDTO
{
    public   OrderId?: number=0;
    public OrderDescription?:string="";
    public   StudentNumbers?:number=0;
    public   ReqStudentNumbers?:number=0;
    public   PractTitle?:string=""
    public   IsAssessment ?:Boolean=false;
    public   IsService?:Boolean=false;
    public   IsTheory?:Boolean=false;
    public   IsPractical?:Boolean=false;
}

export   class ClassGridDTO
{
    public   ClassId?:number=0;
    public   ClassCode?:string="";
    public   Name?:string="";
    public   ClassMatsAcc ?:string="";
    public   ClassContactHrs?:number=0;
    public  ClassMinAttend ?:number=0;
    public  ClassHrsPerWk ?:number=0;
    public ClassCohort?:number=0;
}

export   class VwWeekGridDTO
{
    public WeekId?:number=0;
    public  WeekNo? :number=0;
    public  WeekName ?:string="";
}

export class VwUnitsDTO
{
    public   UnitId?:number=0;
    public    UnitCode?:string="";
    public   UnitTitle?:string="";
}
export class vw_GetUserGridDTO
{
    public   UserId?:number=0;
    public    UserName?:string="";
}

export class VwPo
{
  public   Poid?:string="";
  public   Pono ?:string="";
  public   CompanyName?:string="";
  public   DeliveryDate ?:string="";
  public  PaymentTerms?:string="";
  public  Orderedby ?:string="";

}


