// src/app/directives/cep-mask.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCepMask]',
  standalone: true
})
export class CepMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    if (value.length > 5) {
      event.target.value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    } else {
      event.target.value = value;
    }
  }
}
