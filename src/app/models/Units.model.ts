export class UnitsDTO
{
    public  UnitId?: number=0;
    public  UnitCode? : string="";
    public  UnitTitle? :string="";
    public  UnitCrval? : number=0;
    public  UnitLevel ?: number=0;
    public  UnitVersion? : number=0;
    public  UnitLevy?: number=0;
    public  UnitMaterials?: number=0;
    public   UnitRange? :string="";
    public  UnitElements?:UnitElementsDTO[]=[];
}

export class UnitElementsDTO
{
    public   UnitelementId ?: number=0;
    public   UnitId ?: number=0;
    public   ElementNo?: number=0;
    public   ElementName ? :string="";
    public   ElemntGUID?:string=""
    public   Pcs?:PcsDTO[]=[];
}

export class PcsDTO
{
    public   Elpcid?: number=0;
    public   UnitelementId ?: number=0;
    public   Pcnum ?: number=0;
    public   Pctext:string="";
    public   PCsGuid?:string=""
    public    RangeNotes?:RangeNotesDTO[]=[];
}

export class RangeNotesDTO
{
    public   RangeNoteId ?: number=0;
    public   Elpcid ?: number=0;
    public   RangeText:string="";
    public   JudgeText :string="";
    public   RangeGUID?:string=""
}


