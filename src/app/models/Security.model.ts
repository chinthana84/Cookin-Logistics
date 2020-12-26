
export class SecurityModel
{
    public   UserName ?: string="";
    public   IsAuthenticated ?: Boolean=false ;

    public   BearerToken ?: string="";

    public   CanAccessSupplier ?: Boolean=false;
    public   CanAccessCategory ?: Boolean =false;

//CanAccessSupplier
//CanAccessCategory
}

export class Login {
  UserName: string;
  Password: string;
}


export   class ClaimTypesDTO
{


    public   ClaimTypeId?:number=0;
    public   ClaimType ?:string=""
    public   MenuHeader ?:string=""

}

export   class UserDetailsDTO
{
    public   UserId  ?:number=0;
    public   UserName  ?:string=""
    public   Password  ?:string=""
    public UserClaimsX?:UserClaimsXDTO[];

}

export  class UserClaimsXDTO
{
    public   ClaimId  ?:number=0;
    public   UserId  ?:number=0;
    public  ClaimTypeId  ?:number=0;
    public  ClaimValue  ?:boolean=false;

}


export  class UserRightsDTO
{

       public   ClaimTypeID?:number=0;
    public   ClaimType ?:string=""
    public   MenuHeader ?:string=""

    public   ClaimValue ?:Boolean;
    public   ClaimID ?:number=0;

    public rights?: UserRightsDTO[];
    public controlID ?:string="";

    public userid?:number=0;

}
