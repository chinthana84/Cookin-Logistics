import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable() export class ConfirmDialogService {
    private subject = new Subject<any>();

    confirmThis(message: string, yesFn: () => void, noFn: () => void): any {
        this.setConfirmation(message, yesFn, noFn,"confirm");
    }

    messageBox(message: string): any {
        this.setMessageBox(message,function (){},"ok")
    }

    setConfirmation(message: string, yesFn: () => void, noFn: () => void,msgtype): any {
        const that = this;
        this.subject.next({
            type: msgtype,
            text: message,

            yesFn(): any {
                    that.subject.next(); // This will close the modal
                    yesFn();
                },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });

    }

    setMessageBox(message: string,noFn: () => void, msgtype): any {
        const that = this;
        this.subject.next({
            type: msgtype,
            text: message
            , noFn(): any {
                that.subject.next();
                noFn();
            }
        });

    }


    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}