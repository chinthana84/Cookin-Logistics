import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenApiModel } from 'src/app/models/Security.model';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router, private http: HttpClient) {
  }
  async canActivate() {
    
    const token = localStorage.getItem("todoBearerToken");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
    //  console.log(this.jwtHelper.decodeToken(token));
      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["login"]);
    }

    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      return false;
    }

    //const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });

   const credentials=new TokenApiModel();
   credentials.AccessToken=token;
   credentials.RefreshToken=refreshToken;


    let isRefreshSuccess: boolean;
    try {
      const response = await this.http.post(`${environment.APIEndpoint}/Token/Refresh`, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        observe: 'response'
      }).toPromise();
      // If token refresh is successful, set new tokens in local storage.
      const newToken = (<any>response).body.accessToken;
      const newRefreshToken = (<any>response).body.refreshToken;
      localStorage.setItem("todoBearerToken", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      isRefreshSuccess = true;
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }

}
