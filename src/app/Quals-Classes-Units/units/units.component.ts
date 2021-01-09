import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { PcsDTO, RangeNotesDTO, UnitElementsDTO, UnitsDTO } from 'src/app/models/Units.model';
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

            this.model.UnitElements.forEach(element => {

              element.ElemntGUID=this.newGuid();

              element.Pcs.forEach(e1 => {
                  e1.PCsGuid=this.newGuid();

                  e1.RangeNotes.forEach(e2 => {
                    e2.RangeGUID=this.newGuid();

                  });
              });

            });

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
    obj.ElemntGUID=this.newGuid();

    if (this.model.UnitElements === undefined) {
      this.model.UnitElements = [];
    }
    this.model.UnitElements.push(obj);
  }

  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  AddPcs(pc: PcsDTO[],elementId:number)
  {

    if (pc===undefined){
      let pcx:PcsDTO[]=[];
      pc=pcx;
    }
    let obj = new PcsDTO;
    obj.PCsGuid=this.newGuid();
    obj.UnitelementId=elementId;
    pc.push(obj);
  }

  AddPcsInit(ele: UnitElementsDTO, elementId:number)
  {
    let pcx:PcsDTO[]=[];
    let obj = new PcsDTO;
    obj.UnitelementId=elementId;
    obj.PCsGuid=this.newGuid();
    pcx.push(obj);
    ele.Pcs=pcx;
  }

  AddRangeInit(pc: PcsDTO, pcid:number)
  {
    let pcx:RangeNotesDTO[]=[];
    let obj = new RangeNotesDTO;
    obj.RangeGUID=this.newGuid();
    obj.Elpcid=pcid;
    pcx.push(obj);
    pc.RangeNotes=pcx;


  }

  AddRangeNotes(rn: RangeNotesDTO[],pcID:number)
  {
    let obj = new RangeNotesDTO;
    obj.RangeGUID=this.newGuid();
    obj.Elpcid=pcID;
    rn.push(obj);
  }

  // AddPcs() {
  //  
  //   if (this.selectedPCs === undefined) {
  //     this.selectedPCs = [];
  //     let obj = new PcsDTO;
  //     obj.UnitelementId = this.selectedElementID;
  //     this.selectedPCs.push(obj);
  //   } else {
  //     let obj = new PcsDTO;
  //     obj.UnitelementId = this.selectedElementID;
  //     this.selectedPCs.push(obj);
  //   }

  //   this.model.UnitElements.forEach(element => {
  //     if (element.UnitelementId === this.selectedElementID) {
  //       element.Pcs=this.selectedPCs;
  //     }
  //   });
  // }

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
