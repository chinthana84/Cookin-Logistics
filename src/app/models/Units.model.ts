export   class UnitsDTO
{
    public  UnitId?: number=0;
    public  UnitCode? : number=0;
    public  UnitTitle? :string="";
    public  UnitCrval? : number=0;
    public  UnitLevel ?: number=0;
    public  UnitVersion? : number=0;
    public  UnitLevy?: number=0;
    public  UnitMaterials?: number=0;
    public   UnitRange? :string="";
    public  UnitElements?:UnitElementsDTO[]=[];
}

export   class UnitElementsDTO
{
    public   UnitelementId ?: number=0;
    public   UnitId ?: number=0;
    public   ElementNo?: number=0;
    public   ElementName ? :string="";
    public   Pcs?:PcsDTO[]=[];
}

export class PcsDTO
{
    public   Elpcid?: number=0;
    public   UnitelementId ?: number=0;
    public   Pcnum ?: number=0;
    public   Pctext:string="";

}


