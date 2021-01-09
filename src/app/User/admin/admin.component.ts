import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridType } from 'src/app/models/gridType.enum';
import { UserDetailsDTO, UserRightsDTO } from 'src/app/models/Security.model';
import { Tutor } from 'src/app/models/tutor.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { GridService } from 'src/app/_shared/_grid/grid-service/grid.service';
import { GridOptions } from 'src/app/_shared/_grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/_shared/_grid/gridModels/searchObject.model';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private subs = new SubSink();
  edited: boolean = false;
  newUser:Boolean=false;
   modelUserRights:UserRightsDTO[]=[];
   modelUserDetails:UserDetailsDTO={};

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.UserAdmin
      , defaultSortColumnName: "UserID",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "UserName", colText: ' UserName' }
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

  this.subs.sink=  this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = false;
        this.newUser=true;
        this.modelUserDetails = new UserDetailsDTO();
      } else if (params.id > 0) {
        this.edited = true;
        this.newUser=false;
        this.subs.sink=    this.http
          .get<any>(`${environment.APIEndpoint}/User/GetUserRightsByUserID/` + params.id)
          .subscribe((data) => {
            this.modelUserRights = data;
           
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
      } else {
        this.edited = false;
        this.newUser=false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink=   this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: Tutor) {
    if (obj == undefined) {
      this.router.navigate(['/admin/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/admin/edit'], { queryParams: { id: obj.TutorId } });
    }
    this.edited = true
  }

  UserAcess(userid :number){
    this.router.navigate(['/admin/edit'], { queryParams: { id: userid } });
  }

  onSubmit() {

    this.subs.sink=   this.http
      .post<any>(`${environment.APIEndpoint}/User/SaveRights`, this.modelUserRights, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['admin']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

  SaveUser(){
    this.subs.sink=   this.http
    .post<any>(`${environment.APIEndpoint}/User/SaveUser`, this.modelUserDetails, {})
    .subscribe((data) => {
      if (data.IsValid == false) {
        this.confirmDialogService.messageListBox(data.ValidationMessages)
      }
      else {
        this.toastr.success(environment.dataSaved);
        this.router.navigate(['admin']);
        this.setPage(this.gridOption.searchObject);
      }
    }, (error) => {

      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

}
