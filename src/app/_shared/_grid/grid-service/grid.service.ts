import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchObject } from '../gridModels/searchObject.model';

@Injectable()
export class GridService {
x:SearchObject={};
  private data = new BehaviorSubject<SearchObject>(this.x);
  currentData = this.data.asObservable()

  constructor() { }

  updateMessage(item: any) {
    this.data.next(item);
}
}
