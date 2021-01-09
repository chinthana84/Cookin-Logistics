import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/Security.model';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';
import { ConfirmDialogService } from 'src/app/_shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/_shared/_services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private securityService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {}


  loginViewModel: Login;
  Login(): void {
    this.securityService.Login(this.loginViewModel).subscribe(

      (item) => {
              this.securityService.securityModel=item;

        this.router.navigate(['home'] );
      },
      (error) => {
        this.confirmDialogService.messageBox("invalid username or password")
       
      }
    );
  }
  ngOnInit(): void {
    this.loginViewModel = { UserName: "", Password: "" };
  }

}
