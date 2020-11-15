import { GridOptions } from '../_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from '../_shared/_grid/gridModels/searchObject.model';
import { RefTable } from './reftable.model';

export class Wrapper {
  public Courses?: RefTable[]=[];
  public MOCs?: RefTable[]=[];
  public CookingTime?:RefTable[]=[];
  public CuisneTypes?:RefTable[]=[];
}

export interface Human {

  getTyrePressure: () => void;

  gridOption: GridOptions;
  searchObject: SearchObject ;
}

