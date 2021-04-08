import { Component, Input, OnInit } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.scss']
})

export class ConfirmDialogComponent implements OnInit {
    message: DialogMessage;

    constructor(
        private confirmDialogService: ConfirmDialogService
    ) { }

    ngOnInit(): any {
       /**
        *   This function waits for a message from alert service, it gets
        *   triggered when we call this from any other component
        */
        this.confirmDialogService.getMessage().subscribe(message => {

            this.message = message;

        });


    }
}


export class DialogMessage {
  public type?: string = '';
public msg?: string='';
public msgList? :string[] =[];

 noFn?: () => void ;
 yesFn?: () => void;


}


