import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private auth: AuthenticationService,
    private http: HttpClient,
    private router: Router) { }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

}
