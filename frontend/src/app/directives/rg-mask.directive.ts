import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRgMask]',
  standalone: true
})
export class RgMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\dXx]/g, '').toUpperCase();

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    value = this.formatRG(value);

    if (input.value !== value) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  }

  private formatRG(value: string): string {
    const cleanValue = value.replace(/[^\dX]/g, '');

    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})([\dX])/, '$1-$2')
      .replace(/(-\w{1}).+?$/, '$1');
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const value = input.value;

    if (value && !/^\d{2}\.\d{3}\.\d{3}-\w{1}$/.test(value)) {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  }
}
