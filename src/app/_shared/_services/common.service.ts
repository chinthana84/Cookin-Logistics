import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Login, SecurityModel } from 'src/app/models/Security.model';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';
import { environment } from 'src/environments/environment';

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

  goCNN(url) {
    window.open(`${environment.RptAPI}/${url}`, '_blank');
  }
  private _securityModel: SecurityModel;


  // private messageSource = new BehaviorSubject('default message');
  // currentMessage = this.messageSource.asObservable();
  private _securityModel2 = new BehaviorSubject<SecurityModel>(new SecurityModel());
  currentSecurityObject = this._securityModel2.asObservable();


  get securityModel() {
    return this._securityModel;
  }
  set securityModel(value: SecurityModel) {
    this._securityModel = value;
  }

  public logout() {
    this._securityModel=new   SecurityModel();
    sessionStorage.removeItem("todoBearerToken");
  }

  public Login(userForm: Login): Observable<SecurityModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post<SecurityModel>(
        `${environment.APIEndpoint}/User/Login`,
        userForm,
        httpOptions
      )
      .pipe(
        tap((result) => {
          this.securityModel=new SecurityModel();
          Object.assign(this.securityModel, result);
          //Now check if Authenticated is true store token in sessionStorage
          if (this.securityModel.IsAuthenticated) {
            this._securityModel2.next(result);
            sessionStorage.setItem(
              "todoBearerToken",
              this.securityModel.BearerToken
            );
          } else {
            this.securityModel=new SecurityModel();
          }
        })
      );
  }

}
