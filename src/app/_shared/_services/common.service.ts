import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { Login, SecurityModel, TokenApiModel } from 'src/app/models/Security.model';
import { AuthenticationService } from 'src/app/MyServices/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private isSaved=new Subject<boolean>();

  public Saved(){
      this.isSaved.next(true);
  }

  public IsSavedCurrentStatus(){
    return this.isSaved.asObservable();
  }

  constructor(private auth: AuthenticationService,
    private http: HttpClient,
    private router: Router) { }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getUserLoggedUserName(){
    return localStorage.getItem("username")
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

      localStorage.removeItem("refreshToken");
      localStorage.removeItem( "username" )

      localStorage.removeItem("pw");
      this.router.navigate(['login']);


  }




  public Login(userForm: Login): Observable<SecurityModel> {
debugger
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

            localStorage.setItem("refreshToken", this.securityModel.RefreshToken);
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


  public Referesh(): Observable<SecurityModel> {

    const credentials=new TokenApiModel();

    const token: string = localStorage.getItem("todoBearerToken");
    const refreshToken: string = localStorage.getItem("refreshToken");
    credentials.AccessToken=token;
    credentials.RefreshToken=refreshToken;

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post<SecurityModel>(
        `${environment.APIEndpoint}/Token/Refresh`,
        credentials,
        httpOptions
      )
      .pipe(
        share(),
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

            localStorage.setItem("refreshToken", this.securityModel.RefreshToken);

          } else {
            this.securityModel = new SecurityModel();
          }
          return <any>result;

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
