import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';


@Directive({
  selector: 'button[type=submit]'
})
class PreventDoubleSubmit {

  @HostBinding() disabled: boolean = false;

  @Input() valid: boolean = true;

  @HostListener('click')
  clickEvent(event) {

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.disabled = true;
  }
}
