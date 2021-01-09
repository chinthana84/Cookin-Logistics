import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public errorMessage: string = '';

  constructor(private router: Router,
    private confirmDialogService: ConfirmDialogService) { }

  public handleError = (error: HttpErrorResponse) => {

    if(error.status === 401){
      this.handle500Error(error);
    }
    else if(error.status === 404){
      this.handle404Error(error)
    }
    else if(error.status === 403){
      this.handle403Error(error)
    }
    else{
      //this.handleOtherError(error);

      this.confirmDialogService.messageBox(environment.APIerror);
    }
  }

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }

  private handle403Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/403']);
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    //TODO: this will be fixed later;
  }

  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  }
}
