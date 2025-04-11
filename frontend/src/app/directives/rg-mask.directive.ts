import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRgMask]',
  standalone: true
})
export class RgMaskDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\dXx]/g, '').toUpperCase();

    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    const formatted = this.formatRG(value);
    input.value = formatted;

    if (this.control?.control) {
      this.control.control.setValue(formatted, { emitEvent: false });
    }
  }

  private formatRG(value: string): string {
    // 00.000.000 ou 00.000.000-0
    return value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{3}\.\d{3})([\dX])/, '$1-$2');
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;

    const isValid = /^\d{2}\.\d{3}\.\d{3}(-[\dX])?$/.test(value);

    input.classList.toggle('is-invalid', !isValid);
  }
}
