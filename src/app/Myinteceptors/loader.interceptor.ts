import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, filter, finalize, map, switchMap, take, tap } from "rxjs/operators";
import { LoaderService } from '../MyServices/loader.service';
import { throwError } from "rxjs";
import { CommonService } from "../_shared/_services/common.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {


  private isTokenRefreshing: boolean = false;

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor (public loaderService: LoaderService,private commonService : CommonService) {}

  intercept(request : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>>
  {
      // Check if the user is logging in for the first time
      this.loaderService.show();
      return next.handle(this.attachTokenToRequest(request)).pipe(
          tap((event : HttpEvent<any>) => {
              if(event instanceof HttpResponse)
              {
                this.loaderService.hide();
              }
          }),

          catchError((err) : Observable<any> => {
            this.loaderService.hide();
              if(err instanceof HttpErrorResponse) {
                  switch((<HttpErrorResponse>err).status)
              {
                      case 401:
                          console.log("Token expired. Attempting refresh ...");
                          return this.handleHttpResponseError(request, next);
                      case 400:
                        // alert('asdfasdf')
                           return <any>this.commonService.logout();
                        //return this.handleHttpResponseError(request, next);

                  }
              } else
              {
                  return throwError(this.handleError);
              }
          })

         );

  }


  // Global error handler method
  private handleError(errorResponse : HttpErrorResponse)
  {
      let errorMsg : string;

      if(errorResponse.error instanceof Error)
      {
           // A client-side or network error occurred. Handle it accordingly.
          errorMsg = "An error occured : " + errorResponse.error.message;
      } else
      {
          // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
      }

       return throwError(errorMsg);
  }


  // Method to handle http error response
  private handleHttpResponseError(request : HttpRequest<any>, next : HttpHandler)
  {

      // First thing to check if the token is in process of refreshing
      if(!this.isTokenRefreshing)  // If the Token Refresheing is not true
      {
          this.isTokenRefreshing = true;

          // Any existing value is set to null
          // Reset here so that the following requests wait until the token comes back from the refresh token API call
          this.tokenSubject.next(null);

          /// call the API to refresh the token
          return this.commonService.Referesh().pipe(
              switchMap((tokenresponse: any)  => {
                  if(tokenresponse)
                  {
                    debugger
                      this.tokenSubject.next(tokenresponse.BearerToken);

                      // localStorage.setItem(
                      //   "todoBearerToken",
                      //   this.securityModel.BearerToken
                      // );

                      // localStorage.setItem("refreshToken", this.securityModel.RefreshToken);

                      return next.handle(this.attachTokenToRequest(request));

              }
                  return <any>this.commonService.logout();
              }),
              catchError(err => {
                  this.commonService.logout();
                  return this.handleError(err);
              }),
              finalize(() => {
                this.isTokenRefreshing = false;
              })
              );

      }
      else
      {
          this.isTokenRefreshing = false;
          return this.tokenSubject.pipe(filter(token => token != null),
              take(1),
              switchMap(token => {
              return next.handle(this.attachTokenToRequest(request));
              }));
      }


  }


  private attachTokenToRequest(request: HttpRequest<any>)
  {
      var token = localStorage.getItem('todoBearerToken');

      return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
  }

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
    //           debugger
    //           alert(error)
    //           ////this.errorDialogService.openDialog(data);
    //           return throwError(error);

    //       }));



    // }

  }
