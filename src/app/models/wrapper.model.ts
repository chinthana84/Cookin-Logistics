import { GridOptions } from '../_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from '../_shared/_grid/gridModels/searchObject.model';
import { Product } from './product.model';
import { RefTable } from './reftable.model';

export class Wrapper {
  public Courses?: RefTable[]=[];
  public MOCs?: RefTable[]=[];
  public CookingTime?:RefTable[]=[];
  public CuisneTypes?:RefTable[]=[];
  public ProdUnits?:RefTable[]=[];
  public Products?: Product []=[];
}

export interface IMyGrid {

 // getTyrePressure: () => void;
   setPage(obj: SearchObject):void;

  gridOption: GridOptions;

}

