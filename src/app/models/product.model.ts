import { Categories } from './categories.model';
import { Supplier } from './supplier.model';

export class Product {
  public ProductId?: number = 0;
  public ProductName?: string;
  public ProdUnitId?: Number=0;
  public UnitPrice?: number=0;
  public ProductNotes?: string
  public Yield?: number=0
  public Hrfood?: boolean=false;

  public   CategoryId? :number=0
  public SupplierId?: number = 0;



  public Supplier?: Supplier
  public Category?: Categories

  public    ProductStorages? :ProductStorages[] =[] ;
}

export   class ProductStorages
{
    public  ProductStorageId?: number = 0;
    public  StoreId?: number = 0;
    public  ProductId?: number = 0;

}

export class StorageAreas
{
     public   StoreId ?:number=0
    public   StoreName?:string=''


}
