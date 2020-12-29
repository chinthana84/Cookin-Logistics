export   class QualsDTO
{
    public  QualId?:number=0;
    public  QualName ?:string;
    public  CreditValue ?:number=0;
    public  Eft ?:number=0;
    public  Hours?:number=0;

    public     QulificationModules?:QulificationModulesDTO[]=[];
    public   QulificationUnits?:QulificationUnitsDTO[]=[];
 }

  export   class QulificationModulesDTO
 {
     public   QuliModuleId?:number=0;
     public   QualId ?:number=0;
     public   RefId?:number=0;
 }


 export   class QulificationUnitsDTO
 {
     public   QuliUnitId ?:number=0;
     public   QualId?:number=0;
     public   UnitId ?:number=0;

 }

