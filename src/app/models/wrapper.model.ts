import { GridOptions } from '../_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from '../_shared/_grid/gridModels/searchObject.model';
import { Class } from './ClassDTO';
import { Kitchens } from './kitches.modele';
import { Order } from './order.model';
import { Product } from './product.model';
import { Recipe } from './recipe.model';
import { RefTable } from './reftable.model';
import { Timeslots } from './Timeslots.model';
import { Tutor } from './tutor.model';
import { UnitsDTO } from './Units.model';

export class Wrapper {
  public Courses?: RefTable[]=[];
  public MOCs?: RefTable[]=[];
  public CookingTime?:RefTable[]=[];
  public CuisneTypes?:RefTable[]=[];
  public ProdUnits?:RefTable[]=[];
  public Products?: Product []=[];

  public StandradUnits?: RefTable []=[];
  public YieldUnits?: RefTable []=[];

  public Tutors?:Tutor[]=[];
  public Venues?:Kitchens[]=[];
  public Sessions?:Timeslots[]=[];
  public Classes?:Class[]=[];
  public Orders?:Order[]=[];

  public   Recipes?:Recipe[]=[];

  public units?:UnitsDTO[]=[];
  public cookModules?:RefTable[]=[];

}

export interface IMyGrid {

 // getTyrePressure: () => void;
   setPage(obj: SearchObject):void;

  gridOption: GridOptions;

}

