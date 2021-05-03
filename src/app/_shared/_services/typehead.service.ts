import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TypeHeadSearchDTO } from 'src/app/models/typeheadSearchDTO.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeheadService {

  constructor(private http: HttpClient) {}



  TypeHeadSearch(term: string,id:number) {
    debugger
    return this.http
      .get<TypeHeadSearchDTO[]>(`${environment.APIEndpoint}/Token/TypeHeadSearch/${term}/${id}` );
  }

 
}
