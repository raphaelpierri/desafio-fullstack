import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cnpj', standalone: true })
export class CnpjPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
