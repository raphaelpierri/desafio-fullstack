import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCnpjMask]',
  standalone: true
})
export class CnpjMaskDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) {
      value = value.substring(0, 14);
    }

    value = this.applyMask(value);

    if (this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
    input.value = value;
  }

  private applyMask(value: string): string {
    if (value.length <= 2) {
      return value;
    } else if (value.length <= 5) {
      return `${value.substring(0, 2)}.${value.substring(2)}`;
    } else if (value.length <= 8) {
      return `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5)}`;
    } else if (value.length <= 12) {
      return `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8)}`;
    } else {
      return `${value.substring(0, 2)}.${value.substring(2, 5)}.${value.substring(5, 8)}/${value.substring(8, 12)}-${value.substring(12, 14)}`;
    }
  }
}
