import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/models/Security.model';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/_shared/_services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  private subs = new SubSink();


  model:Login={}

  constructor(
    private commonService: CommonService,
    private http: HttpClient, public router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {

  }

  ngOnInit(): void {

   this.model.UserName= sessionStorage.getItem("username")
  }

  changepassword(){
    this.subs.sink=   this.http
    .post<any>(`${environment.APIEndpoint}/User/ChangePW`, this.model, {})
    .subscribe((data) => {
      if (data.IsValid == false) {
        this.confirmDialogService.messageListBox(data.ValidationMessages)
      }
      else {
        this.toastr.success(environment.dataSaved);
        this.router.navigate(['login']);

      }
    }, (error) => {

      this.confirmDialogService.messageBox(environment.APIerror)
    });

  }
}
