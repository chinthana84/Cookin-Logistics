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

  downloadFile(filename) {

  //   return this.http.get(this.url + '/GetImage?image=' + image, {
  //     responseType: 'blob'
  // });

      this.http.get(`${environment.APIEndpoint}/Common/Download/` + filename
      , {
        responseType: 'blob'
      }).subscribe(x=> {
        console.log(x)
        const url= window.URL.createObjectURL(x);
        window.open(url);
       // return x;
      });

  }

  private _securityModel: SecurityModel;


  private _securityModel2 = new BehaviorSubject<SecurityModel>(new SecurityModel());
  currentSecurityObject = this._securityModel2.asObservable();

  get securityModel() {
    return this._securityModel;
  }

  set securityModel(value: SecurityModel) {
    this._securityModel = value;
  }

  public logout() {
    this._securityModel = new SecurityModel();
    localStorage.removeItem("todoBearerToken");
    localStorage.removeItem("username");
    localStorage.removeItem("pw");
    this.router.navigate(['login']);
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
          this.securityModel = new SecurityModel();
          Object.assign(this.securityModel, result);
          //Now check if Authenticated is true store token in sessionStorage
          if (this.securityModel.IsAuthenticated) {
            this._securityModel2.next(result);

            localStorage.setItem(
              "todoBearerToken",
              this.securityModel.BearerToken
            );
            localStorage.setItem(
              "username",
              userForm.UserName
            )

            localStorage.setItem(
              "pw",
              userForm.Password
            )
          } else {
            this.securityModel = new SecurityModel();
          }
        })
      );
  }







  upload(fileToUpload: any) {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http
      .post(`${environment.APIEndpoint}/Common/UploadFile`, input);
  }

}
