import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { PcsDTO, UnitElementsDTO, UnitsDTO } from 'src/app/models/Units.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html'
})
export class UnitsComponent implements OnInit {

  private subs = new SubSink();
  model = new UnitsDTO();

  edited: boolean = false;
  selectedElementID: number = 0;
  selectedPCs: PcsDTO[];


  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Units
      , defaultSortColumnName: "UnitId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "UnitCode", colText: ' UnitCode' },
      { colName: "UnitTitle", colText: 'UnitTitle' }
      ]
    }
  };


  constructor(private gridService: GridService,

    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.edited = false
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new UnitsDTO();
      } else if (params.id > 0) {
        this.edited = true;
        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetUnitByID/` + params.id)
          .subscribe((data) => {
            this.model = data;
           this.selectedElementID=0;
           this.selectedPCs=[];

          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: UnitsDTO) {
    if (obj == undefined) {
      this.router.navigate(['/units/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/units/edit'], { queryParams: { id: obj.UnitId } });
    }
    this.edited = true
  }

  AddElement() {


    let obj = new UnitElementsDTO();

    if (this.model.UnitElements === undefined) {
      this.model.UnitElements = [];
    }
    this.model.UnitElements.push(obj);
  }

  LoadPCs(id: number) {
    this.selectedElementID = id;
    // this.model.UnitElements.forEach(element => {
    //   element.Pcs.forEach(e => {
    //     this.selectedPCs.push(e)
    //   });

    // });


    if (this.selectedPCs === undefined) {
      this.selectedPCs = [];
    }
    else {



      this.model.UnitElements.forEach(element => {
        if (element.UnitelementId === this.selectedElementID) {
          this.selectedPCs=element.Pcs;
        }
      });

      this.selectedPCs = this.selectedPCs.filter(item => item.UnitelementId == this.selectedElementID);
    }

  }

  AddPcs() {
    debugger
    if (this.selectedPCs === undefined) {
      this.selectedPCs = [];
      let obj = new PcsDTO;
      obj.UnitelementId = this.selectedElementID;
      this.selectedPCs.push(obj);
    } else {
      let obj = new PcsDTO;
      obj.UnitelementId = this.selectedElementID;
      this.selectedPCs.push(obj);
    }

    this.model.UnitElements.forEach(element => {
      if (element.UnitelementId === this.selectedElementID) {
        element.Pcs=this.selectedPCs;
      }
    });
  }

  onSubmit(obj: UnitsDTO) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/common/SaveUnit`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['units']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }
}
