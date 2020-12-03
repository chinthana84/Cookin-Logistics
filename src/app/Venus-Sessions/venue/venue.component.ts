import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { Kitchens } from 'src/app/models/kitches.modele';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {
  edited: boolean = false;

  model: Kitchens = {};


  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Kitchen
      , defaultSortColumnName: "KitchenId",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "KitchenCode", colText: ' KitchenCode' },
      { colName: "KitchenName", colText: 'KitchenName' }
      ]
    }
  };


  constructor(private gridService: GridService,

    private commonService: CommonService,
    private http: HttpClient, private router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.edited = false
  }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;

        this.model = new Kitchens();
      } else if (params.id > 0) {
        this.edited = true;
        this.http
          .get<any>(`${environment.APIEndpoint}/Common/GetKitchenByID/` + params.id)
          .subscribe((data) => {
            this.model = data;
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: Kitchens) {
    if (obj == undefined) {
      this.router.navigate(['/venue/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/venue/edit'], { queryParams: { id: obj.KitchenId } });
    }
    this.edited = true
  }

  onSubmit(obj: Kitchens) {

    this.http
      .post<any>(`${environment.APIEndpoint}/common/SaveKitchen`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['venue']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }


}
