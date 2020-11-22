import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,    private authentication: AuthenticationService) {
    this.authentication.logout();

   }

  ngOnInit( ): void {
    this.authentication.logout();
  }

  login(){
    this.authentication.login();
    this.router.navigate(['/home'] );
  }

}
