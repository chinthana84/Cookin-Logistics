import {Directive, ElementRef, HostListener, Input} from '@angular/core';

const DISABLE_TIME = 300;

@Directive({
    selector: '[disableAfterClick]'
})

export class DisableButtonAfterClickDirective {

    constructor(private elementRef: ElementRef) { }
    @HostListener('click', ['$event'])
    clickEvent() {
        this.elementRef.nativeElement.setAttribute('disabled', 'true');
        setTimeout(() => this.elementRef.nativeElement.removeAttribute('disabled'), DISABLE_TIME);
    }


}
