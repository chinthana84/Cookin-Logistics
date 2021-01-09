import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridType } from 'src/app/models/gridType.enum';
import { QualsDTO, QulificationModulesDTO, QulificationUnitsDTO } from 'src/app/models/quli.model';
import { Recipe } from 'src/app/models/recipe.model';
import { Wrapper } from 'src/app/models/wrapper.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { QuliClassUniModule } from '../quli-class-uni.module';

@Component({
  selector: 'app-qulificaton',
  templateUrl: './qulificaton.component.html'
})
export class QulificatonComponent implements OnInit {

  private subs = new SubSink();
  edited: boolean = false;
  modelWrapper: Wrapper = {};
  modelQulification: QualsDTO = {};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Quli
      , defaultSortColumnName: "QualName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "QualName", colText: 'Qual Name' }
      ]
    }
  };



  constructor(
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    private commonService: CommonService,
    private gridService: GridService
  ) {
    this.edited = true;
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink =   this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
        this.modelQulification = new QualsDTO();

        this.subs.sink =   this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetQulificationRelatedData`)
          .subscribe((data) => {
            this.modelWrapper = data;
        
          });
      } else if (params.id > 0) {
        this.edited = true;
        let a = this.http.get<any>(`${environment.APIEndpoint}/Common/GetQulificaitonByID/` + params.id);
        let b = this.http.get<any>(`${environment.APIEndpoint}/Common/GetQulificationRelatedData`)

        this.subs.sink =   forkJoin([a, b]).subscribe(results => {
            this.modelWrapper=results[1];;
            this.modelQulification=results[0];;
        });
      } else {
        this.edited = false;
      }
    });

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setPage(obj: SearchObject): void {
    this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: QualsDTO) {
    if (obj == undefined) {
      this.router.navigate(["/quli/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/quli/edit"], {
        queryParams: { id: obj.QualId },
      });
    }
    this.edited = true;
  }

  AddModules(){
    var obj = new QulificationModulesDTO();
    obj.QualId = this.modelQulification.QualId;
    this.modelQulification.QulificationModules.push(obj);
  }

  AddUnit(){
    var obj = new QulificationUnitsDTO();
    obj.QualId = this.modelQulification.QualId;
    if (this.modelQulification.QulificationUnits==undefined){
      this.modelQulification.QulificationUnits=[];
    }
    this.modelQulification.QulificationUnits.push(obj);
  }

  deleteUnit(id:number){

    this.modelQulification.QulificationUnits =
    this.modelQulification.QulificationUnits.filter(item => item.QuliUnitId != id);

  }
  deleteModule(id:number){

    this.modelQulification.QulificationModules =
    this.modelQulification.QulificationModules.filter(item => item.QuliModuleId != id);

  }
  onSubmit(obj: QualsDTO) {
    this.subs.sink =  this.http
      .post<any>(`${environment.APIEndpoint}/Common/SaveQuli`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['quli']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }


}
