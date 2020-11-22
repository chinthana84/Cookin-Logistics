import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './MyServices/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cookin-Logistics';

  constructor(private router: Router,private authentication: AuthenticationService) { }

 
  ngOnInit(): void {


  }




}
