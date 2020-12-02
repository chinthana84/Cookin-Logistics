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
