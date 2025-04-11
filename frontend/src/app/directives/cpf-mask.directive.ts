import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true
})
export class CpfMaskDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    let digits = input.value.replace(/\D/g, '');

    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }

    const masked = this.applyMask(digits);

    input.value = masked;
    if (this.control?.control) {
      this.control.control.setValue(masked, { emitEvent: false });
    }
  }

  private applyMask(value: string): string {
    if (value.length <= 3) {
      return value;
    } else if (value.length <= 6) {
      return `${value.substring(0, 3)}.${value.substring(3)}`;
    } else if (value.length <= 9) {
      return `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
    } else {
      return `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
    }
  }

  @HostListener('blur')
onBlur(): void {
  const input = this.el.nativeElement as HTMLInputElement;
  const clean = input.value.replace(/\D/g, '');
  if (clean.length !== 11) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
}

}
