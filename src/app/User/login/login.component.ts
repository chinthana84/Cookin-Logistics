import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/Security.model';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';
import { CommonService } from 'src/app/_shared/_services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private router: Router,
    private securityService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {}


  loginViewModel: Login;
  Login(): void {
    this.securityService.Login(this.loginViewModel).subscribe(

      (item) => {
        // if (this.activatedRoute.snapshot.queryParams.returnUrl) {
        //   this.router.navigateByUrl(
        //     this.activatedRoute.snapshot.queryParams.returnUrl
        //   );
        // } else {
        //   //this.router.navigate(["Home", { name: item.userName }]);
        //   this.router.navigate(['/home'] );
        // }
        sessionStorage.setItem(
          "username",
          this.loginViewModel.UserName
        )

        sessionStorage.setItem(
          "pw",
          this.loginViewModel.Password
        )


        this.securityService.securityModel=item;

        this.router.navigate(['home'] );
      },
      (error) => {
        console.log(error)
        alert("invalid username or password");
      }
    );
  }
  ngOnInit(): void {
    this.loginViewModel = { UserName: "", Password: "" };
    // sessionStorage.setItem(
    //   "username",
    //  ""
    // )

    // sessionStorage.setItem(
    //   "pw",
    //   ""
    // )
  }

}
