import { SecurityModel } from 'src/app/models/Security.model';
import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, from, Observable } from "rxjs";
import { catchError, filter, finalize, map, switchMap, take, tap } from "rxjs/operators";
import { LoaderService } from '../MyServices/loader.service';
import { throwError } from "rxjs";
import { CommonService } from "../_shared/_services/common.service";
import { AuthService } from "../_shared/_services/auth.service";
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService,private router: Router,private loaderService :LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return  next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
         return this.handle401Error(request, next);
      } else {
        //this.router.navigate(['login']);
        return throwError(error);
      }
    })).pipe(
         finalize(() => this.loaderService.hide()))
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private isRefreshing = false;
private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  debgger
  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((token: SecurityModel) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(token.BearerToken);
        return next.handle(this.addToken(request, token.BearerToken));
      }));

  } else {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next.handle(this.addToken(request, jwt));
      }));
  }
}
    //     //       return next.handle(request).pipe(
    //     //     finalize(() => this.loaderService.hide())

   // constructor(public loaderService: LoaderService) { }
    // // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // //     this.loaderService.show();
    // //     return next.handle(req).pipe(
    // //         finalize(() => this.loaderService.hide())
    // //     );
    // // }

    // intercept(
    //   request: HttpRequest<any>,
    //   next: HttpHandler
    // ): Observable<HttpEvent<any>> {
    //   this.loaderService.show();

    //   if (localStorage.getItem("todoBearerToken")) {

    //     const headerSettings: {[name: string]: string | string[]; } = {};

    //    if(request.url.split('/')[request.url.split('/').length-1]==="UploadFile"){
    //     for (const key of request.headers.keys()) {
    //       headerSettings[key] = request.headers.getAll(key);
    //     }
    //   //  headerSettings['Content-Type'] = 'multipart/form-data';
    //     // headerSettings['Accept'] = 'application/json';

    //   //  headerSettings['Content-Type'] = 'application/json';

    //    }
    //    else{
    //     for (const key of request.headers.keys()) {
    //       headerSettings[key] = request.headers.getAll(key);
    //     }
    //     headerSettings['Content-Type'] = 'application/json';

    //    }




    //     const newHeader = new HttpHeaders(headerSettings);

    //     headerSettings['Authorization'] = 'Bearer ' + localStorage.getItem("todoBearerToken");
    //     request = request.clone({

    //       setHeaders:  headerSettings

    //     });
    //   }
    //   this.loaderService.show();

    //     //       return next.handle(request).pipe(
    //     //     finalize(() => this.loaderService.hide())
    //     // );


    //     return next.handle(request).pipe(
    //       map((event: HttpEvent<any>) => {
    //           if (event instanceof HttpResponse) {
    //               console.log('event--->>>', event);
    //           }
    //           this.loaderService.hide()
    //           return event;
    //       }),
    //       catchError((error: HttpErrorResponse) => {
    //           let data = {};
    //           data = {
    //               reason: error && error.error && error.error.reason ? error.error.reason : '',
    //               status: error.status
    //           };
    //           this.loaderService.hide();
    //
    //           alert(error)
    //           ////this.errorDialogService.openDialog(data);
    //           return throwError(error);

    //       }));



    // }

  }
